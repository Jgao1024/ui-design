#!/usr/bin/env python3
"""把 SVG 画板裁到内容的真实边界上。

Figma 导出时用的是**图层的外框**，不是内容的边界：一个 1210×117 的「App 图标行」
里可能只有几个图标，右边一大片空白；壁纸画板也一样。结果就是缩略图里内容挤在
左上角、右下角全是空的。

这个模块按几何（path / rect / circle / ellipse / line / polyline / polygon /
image / text）算出内容 bbox，再把根元素的 width / height / viewBox 收进去。
**元素本身一个都不动，不重排、不缩放、不删除。**

保守策略：
  · 两个方向都省不到 10% 就不裁（避免为了几个像素动所有文件）
  · 文件里若有 <defs> 之外的 <use>（可能引用到画布外的东西）就整体跳过
  · 带 filter（投影）的元素按 10px 外扩，宁可多留边也不切掉阴影

单独跑：python3 figma/tools/figma-pull/svg_trim.py figma/reference
"""
from __future__ import annotations

import math
import re
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

MIN_SAVING = 0.90        # 至少省 10% 才动
FILTER_PAD = 10.0        # 有 filter 的元素外扩
MIN_PAD = 2.0            # 保底留白

_NUM = re.compile(r"[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?")
_ROOT_TAG = re.compile(r"<svg\b[^>]*>")


def _nums(s: str) -> list[float]:
    return [float(x) for x in _NUM.findall(s or "")]


def _tag(el) -> str:
    return el.tag.split("}")[-1]


def _mul(a, b):
    return [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1],
            a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3],
            a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]]


IDENT = [1, 0, 0, 1, 0, 0]


def _transform(t: str):
    m = IDENT
    for name, args in re.findall(r"(\w+)\s*\(([^)]*)\)", t or ""):
        v = _nums(args)
        if name == "translate" and v:
            mm = [1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0.0]
        elif name == "scale" and v:
            sx = v[0]
            sy = v[1] if len(v) > 1 else v[0]
            mm = [sx, 0, 0, sy, 0, 0]
        elif name == "rotate" and v:
            a = math.radians(v[0])
            ca, sa = math.cos(a), math.sin(a)
            mm = [ca, sa, -sa, ca, 0, 0]
            if len(v) == 3:
                mm = _mul(_mul([1, 0, 0, 1, v[1], v[2]], mm), [1, 0, 0, 1, -v[1], -v[2]])
        elif name == "matrix" and len(v) == 6:
            mm = list(v)
        elif name == "skewX" and v:
            mm = [1, 0, math.tan(math.radians(v[0])), 1, 0, 0]
        elif name == "skewY" and v:
            mm = [1, math.tan(math.radians(v[0])), 0, 1, 0, 0]
        else:
            continue
        m = _mul(m, mm)
    return m


def _apply(m, x, y):
    return (m[0]*x + m[2]*y + m[4], m[1]*x + m[3]*y + m[5])


def _local_points(el) -> list[tuple[float, float]]:
    t, a = _tag(el), el.attrib
    try:
        if t == "rect":
            x, y = float(a.get("x", 0)), float(a.get("y", 0))
            w, h = float(a.get("width", 0)), float(a.get("height", 0))
            return [(x, y), (x+w, y), (x, y+h), (x+w, y+h)]
        if t == "circle":
            cx, cy, r = float(a.get("cx", 0)), float(a.get("cy", 0)), float(a.get("r", 0))
            return [(cx-r, cy-r), (cx+r, cy+r)]
        if t == "ellipse":
            cx, cy = float(a.get("cx", 0)), float(a.get("cy", 0))
            rx, ry = float(a.get("rx", 0)), float(a.get("ry", 0))
            return [(cx-rx, cy-ry), (cx+rx, cy+ry)]
        if t == "line":
            return [(float(a.get("x1", 0)), float(a.get("y1", 0))),
                    (float(a.get("x2", 0)), float(a.get("y2", 0)))]
        if t in ("polyline", "polygon"):
            v = _nums(a.get("points", ""))
            return list(zip(v[0::2], v[1::2]))
        if t == "path":
            v = _nums(a.get("d", ""))
            # Figma 导出的 path 用绝对坐标命令（M/L/C/H/V/Q/A/Z）。
            # H/V 只给一个数，会让两两配对整体错位，所以按命令逐个推游标。
            d = a.get("d", "")
            return _path_points(d)
        if t == "image":
            x, y = float(a.get("x", 0)), float(a.get("y", 0))
            w, h = float(a.get("width", 0)), float(a.get("height", 0))
            return [(x, y), (x+w, y), (x, y+h), (x+w, y+h)]
        if t == "text":
            fs = float(_first_num(a.get("font-size", "0")) or 0)
            out = []
            for sp in el.iter():
                if _tag(sp) in ("tspan", "text") and sp.get("x"):
                    x = float(_first_num(sp.get("x")))
                    y = float(_first_num(sp.get("y", "0")) or 0)
                    out += [(x, y-fs), (x + fs*6, y+fs*0.3)]
            return out
    except (TypeError, ValueError):
        return []
    return []


def _first_num(s: str) -> str:
    m = _NUM.search(s or "")
    return m.group(0) if m else "0"


_PATH_CMD = re.compile(r"([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)")


def _path_points(d: str) -> list[tuple[float, float]]:
    """按绝对坐标推顶点；相对命令也处理，避免 H/V 让配对错位。"""
    pts: list[tuple[float, float]] = []
    cx = cy = 0.0
    for cmd, args in _PATH_CMD.findall(d or ""):
        v = _nums(args)
        rel = cmd.islower()
        up = cmd.upper()
        if up == "Z":
            continue
        step = {"M": 2, "L": 2, "T": 2, "C": 6, "S": 4, "Q": 4, "A": 7, "H": 1, "V": 1}[up]
        i = 0
        while i + step <= len(v):
            chunk = v[i:i+step]
            if up in ("M", "L", "T"):
                x, y = (cx+chunk[0], cy+chunk[1]) if rel else (chunk[0], chunk[1])
                cx, cy = x, y
                pts.append((x, y))
            elif up == "H":
                cx = cx + chunk[0] if rel else chunk[0]
                pts.append((cx, cy))
            elif up == "V":
                cy = cy + chunk[0] if rel else chunk[0]
                pts.append((cx, cy))
            elif up in ("C", "S", "Q", "A"):
                # 控制点/半径也纳入 bbox，宁可多留
                for j in range(0, step - 2, 2):
                    px, py = chunk[j], chunk[j+1]
                    if rel:
                        px, py = cx + px, cy + py
                    pts.append((px, py))
                ex, ey = chunk[-2], chunk[-1]
                cx, cy = (cx+ex, cy+ey) if rel else (ex, ey)
                pts.append((cx, cy))
            i += step
    return pts


def content_bbox(svg: str):
    """返回 (x0, y0, x1, y1, 画布 w, 画布 h)；没有可用几何时返回 None。"""
    try:
        root = ET.fromstring(svg)
    except ET.ParseError:
        return None
    vb = re.search(r'viewBox="([^"]*)"', svg)
    if vb and len(_nums(vb.group(1))) == 4:
        vx, vy, W, H = _nums(vb.group(1))
    else:
        wm = re.search(r'<svg\b[^>]*\bwidth="([\d.]+)"', svg)
        hm = re.search(r'<svg\b[^>]*\bheight="([\d.]+)"', svg)
        if not (wm and hm):
            return None
        vx, vy, W, H = 0.0, 0.0, float(wm.group(1)), float(hm.group(1))
    if W <= 0 or H <= 0:
        return None

    xs: list[float] = []
    ys: list[float] = []
    saw_use_outside_defs = False

    def walk(el, m, in_defs: bool):
        nonlocal saw_use_outside_defs
        t = _tag(el)
        if t == "svg":
            pass
        elif t in ("defs", "clipPath", "mask", "symbol", "marker"):
            return                      # 定义区不参与可见内容
        if t == "use" and not in_defs:
            saw_use_outside_defs = True
        m = _mul(m, _transform(el.attrib.get("transform", "")))
        pts = _local_points(el) if t not in ("g", "svg", "a", "svg:svg") else []
        pad = FILTER_PAD if el.attrib.get("filter") else 0.0
        for px, py in pts:
            x, y = _apply(m, px, py)
            xs.append(x - pad)
            xs.append(x + pad)
            ys.append(y - pad)
            ys.append(y + pad)
        for c in el:
            walk(c, m, in_defs or t == "defs")

    walk(root, IDENT, False)
    if saw_use_outside_defs or not xs:
        return None
    x0, x1 = min(xs), max(xs)
    y0, y1 = min(ys), max(ys)
    # 夹回画布：注意 viewBox 的原点可能不是 (0,0)
    x0, y0 = max(vx, x0), max(vy, y0)
    x1, y1 = min(vx + W, x1), min(vy + H, y1)
    if x1 <= x0 or y1 <= y0:
        return None
    return (x0, y0, x1, y1, W, H)


def trim_svg(svg: str, min_saving: float = MIN_SAVING):
    """返回 (新内容, 是否改动, (旧w, 旧h, 新w, 新h))。"""
    box = content_bbox(svg)
    if not box:
        return svg, False, None
    x0, y0, x1, y1, W, H = box
    raw = re.search(r'viewBox="([^"]*)"', svg)
    if raw and len(_nums(raw.group(1))) == 4:
        vx, vy = _nums(raw.group(1))[0], _nums(raw.group(1))[1]
    else:
        vx, vy = 0.0, 0.0
    pad = max(MIN_PAD, min(W, H) * 0.01)
    nx0, ny0 = max(vx, x0 - pad), max(vy, y0 - pad)
    nx1, ny1 = min(vx + W, x1 + pad), min(vy + H, y1 + pad)
    nw, nh = nx1 - nx0, ny1 - ny0
    if nw <= 0 or nh <= 0:
        return svg, False, None
    # 两个方向都省不到 10% 就不动
    if nw > W * min_saving and nh > H * min_saving:
        return svg, False, None

    def fmt(v: float) -> str:
        return str(int(round(v))) if abs(v - round(v)) < 1e-6 else f"{v:.2f}"

    m = _ROOT_TAG.search(svg)
    if not m:
        return svg, False, None
    old_tag = m.group(0)
    new_tag = re.sub(r'\bwidth="[^"]*"', f'width="{fmt(nw)}"', old_tag, count=1)
    new_tag = re.sub(r'\bheight="[^"]*"', f'height="{fmt(nh)}"', new_tag, count=1)
    new_tag = re.sub(r'viewBox="[^"]*"',
                     f'viewBox="{fmt(nx0)} {fmt(ny0)} {fmt(nw)} {fmt(nh)}"', new_tag, count=1)
    if new_tag == old_tag:
        return svg, False, None
    return svg.replace(old_tag, new_tag, 1), True, (W, H, nw, nh)


def trim_tree(root: Path) -> None:
    """裁掉所有 SVG 的空白画板，并同步更新 svg/MANIFEST.json 里的 w/h。

    MANIFEST 的 w/h 是 App 用来算缩略图方框比例的，不一起改的话
    App 里仍按旧比例留白。
    """
    import json

    files = sorted(root.rglob("*.svg"))
    n = 0
    new_size: dict[str, tuple[int, int]] = {}
    for f in files:
        old = f.read_text(encoding="utf-8", errors="replace")
        new, changed, dims = trim_svg(old)
        if not changed:
            continue
        f.write_text(new, encoding="utf-8", errors="replace")
        n += 1
        size = content_size(new)
        if size:
            new_size[f.name] = size

    # 同步 MANIFEST
    patched = 0
    for mf in root.glob("*/svg/MANIFEST.json"):
        data = json.loads(mf.read_text(encoding="utf-8"))
        dirty = False
        for it in data.get("items", []):
            name = (it.get("file") or "").rsplit("/", 1)[-1]
            size = new_size.get(name)
            if size and (it.get("w"), it.get("h")) != size:
                it["w"], it["h"] = size
                dirty = True
                patched += 1
        if dirty:
            mf.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    # 同步 _received.jsonl（MANIFEST 是从这里重建的，不改的话下次 build_index 会把 w/h 覆盖回去）
    jl_patched = 0
    for jl in root.glob("*/svg/_received.jsonl"):
        if not jl.exists():
            continue
        lines = []
        dirty = False
        for line in jl.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                lines.append(line)
                continue
            size = new_size.get((row.get("file") or "").rsplit("/", 1)[-1])
            if size and (row.get("w"), row.get("h")) != size:
                row["w"], row["h"] = size
                dirty = True
                jl_patched += 1
            lines.append(json.dumps(row, ensure_ascii=False))
        if dirty:
            jl.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"裁剪 {n} / {len(files)} 个 SVG 画板；MANIFEST 更新 {patched} 条；"
          f"_received.jsonl 更新 {jl_patched} 条")




def content_size(svg: str):
    """读画板尺寸（viewBox 优先），返回 (w, h) 整数；读不到返回 None。"""
    m = re.search(r'<svg\b[^>]*>', svg)
    if not m:
        return None
    tag = m.group(0)
    vb = re.search(r'viewBox="([^"]*)"', tag)
    if vb:
        v = _nums(vb.group(1))
        if len(v) == 4 and v[2] > 0 and v[3] > 0:
            return int(round(v[2])), int(round(v[3]))
    w = re.search(r'\bwidth="([\d.]+)"', tag)
    h = re.search(r'\bheight="([\d.]+)"', tag)
    if w and h:
        return int(round(float(w.group(1)))), int(round(float(h.group(1))))
    return None


if __name__ == "__main__":
    trim_tree(Path(sys.argv[1] if len(sys.argv) > 1 else "figma/reference"))
