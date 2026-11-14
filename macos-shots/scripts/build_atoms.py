#!/usr/bin/env python3
"""从截图 + AX 树里切出归一化组件（原子）。

产物:
  components/<theme>/<class>/<seq>--<app>--<variant>.png   2x 原始切片
  components/<theme>/_1x/<class>/...                      1x（贴原型用）
  components/canonical/<class>--<ahash>.png               跨应用去重后的最佳样本
  components/manifest.csv                                 每片元数据
  components/tokens.csv                                   每片样式测量（高/bg/fg/accent）
"""
import csv
import hashlib
import json
import os
from collections import Counter, OrderedDict, defaultdict

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP = os.path.join(ROOT, "components")
MAX_PER_KIND = 6          # 每个 (类/角色/应用/步骤) 最多保留几片
MIN_W, MIN_H = 18, 14     # 太小不要
MAX_RATIO = 0.92          # 超过窗口 92% 的不要（那是整窗）

# AX role -> 组件类别
CLASSIFY = {
    "AXButton": ("02-button", "push"),
    "AXMenuButton": ("02-button", "menu-button"),
    "AXPopUpButton": ("06-control", "popup-button"),
    "AXCheckBox": ("06-control", "checkbox"),
    "AXRadioButton": ("06-control", "radio"),
    "AXSwitch": ("06-control", "toggle"),
    "AXSlider": ("06-control", "slider"),
    "AXStepper": ("06-control", "stepper"),
    "AXSegmentedControl": ("06-control", "segmented"),
    "AXTabGroup": ("01-navigation", "tab-group"),
    "AXSearchField": ("03-input", "search-field"),
    "AXTextField": ("03-input", "text-field"),
    "AXTextArea": ("03-input", "text-area"),
    "AXComboBox": ("03-input", "combo"),
    "AXMenuItem": ("04-menu", "menu-item"),
    "AXMenuBarItem": ("04-menu", "menubar-item"),
    "AXMenu": ("04-menu", "menu-panel"),
    "AXRow": ("05-list", "row"),
    "AXOutlineRow": ("05-list", "outline-row"),
    "AXListItem": ("05-list", "list-item"),
    "AXCell": ("05-list", "cell"),
    "AXDisclosureTriangle": ("01-navigation", "disclosure"),
    "AXToolbar": ("08-layout", "toolbar"),
    "AXSplitGroup": ("08-layout", "split"),
    "AXTabBar": ("01-navigation", "tab-bar"),
    "AXProgressIndicator": ("07-feedback", "progress"),
    "AXLevelIndicator": ("07-feedback", "level"),
}
SLUG = {"/": "--", " ": "-"}


def slugify(s, limit=28):
    out = []
    for ch in s.strip():
        out.append(SLUG.get(ch, ch))
    t = "".join(out)
    t = "".join(c for c in t if (c.isascii() and c.isalnum()) or c in "-_")
    return t[:limit].strip("-_") or "x"


def load_manifest(theme):
    path = os.path.join(ROOT, "logs", f"manifest-{theme}.csv")
    if not os.path.exists(path):
        return {}
    rows = list(csv.DictReader(open(path, encoding="utf-8")))
    latest = {}
    for r in rows:
        latest[(r["slug"], r["step"])] = r
    return latest


def walk(node, depth=0):
    yield node, depth
    for c in node.get("children", []):
        yield from walk(c, depth + 1)


def ahash(img, size=8):
    g = img.convert("L").resize((size, size), Image.LANCZOS)
    px = list(g.getdata())
    avg = sum(px) / len(px)
    bits = "".join("1" if p > avg else "0" for p in px)
    return f"{int(bits, 2):016x}"


def style_tokens(img):
    small = img.convert("RGB")
    w, h = small.size
    if w > 160:
        small = small.resize((160, max(1, int(h * 160 / w))), Image.LANCZOS)
    cols = Counter(small.getdata())
    bg = cols.most_common(1)[0][0]
    cand = [c for c, n in cols.most_common(12) if n > 5]
    def dist(a, b):
        return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5
    fg = max(cand, key=lambda c: dist(c, bg)) if cand else bg
    accent = max(cand, key=lambda c: (max(c) - min(c))) if cand else bg
    def hx(c):
        return "#%02x%02x%02x" % c
    return hx(bg), hx(fg), hx(accent)


def main():
    os.makedirs(COMP, exist_ok=True)
    man_rows, tok_rows = [], []
    canon = {}      # (class, variant, ahash) -> path
    canon_meta = defaultdict(list)
    seq = defaultdict(int)

    for theme in ("dark", "light"):
        manifest = load_manifest(theme)
        if not manifest:
            continue
        for (slug, step), row in manifest.items():
            png = os.path.join(ROOT, row["file"])
            tree_path = os.path.join(ROOT, "structure", theme, slug, f"{step}.json")
            if not (os.path.exists(png) and os.path.exists(tree_path)):
                continue
            img = Image.open(png)
            scale = img.width / max(1, float(row["win_w"]))
            ox, oy = float(row["win_x"]), float(row["win_y"])
            try:
                tree = json.load(open(tree_path, encoding="utf-8"))["tree"]
            except Exception:
                continue

            seen_kind = defaultdict(int)
            for node, depth in walk(tree):
                role = node.get("role", "")
                if role not in CLASSIFY:
                    continue
                f = node.get("frame")
                if not f:
                    continue
                x, y, w, h = f
                if w < MIN_W or h < MIN_H:
                    continue
                if w > float(row["win_w"]) * MAX_RATIO and h > float(row["win_h"]) * MAX_RATIO:
                    continue
                cls, base = CLASSIFY[role]
                kind = f"{role}|{base}"
                if seen_kind[kind] >= MAX_PER_KIND:
                    continue
                label = node.get("title") or node.get("desc") or node.get("help") or ""
                variant = slugify(label) if label else base
                if role == "AXButton" and not label:
                    variant = "icon"
                box = (int((x - ox) * scale), int((y - oy) * scale),
                       int((x - ox + w) * scale), int((y - oy + h) * scale))
                box = (max(0, box[0]), max(0, box[1]),
                       min(img.width, box[2]), min(img.height, box[3]))
                if box[2] - box[0] < MIN_W or box[3] - box[1] < MIN_H:
                    continue
                crop = img.crop(box)
                if crop.width >= img.width * MAX_RATIO:
                    continue
                seen_kind[kind] += 1
                seq[(theme, cls)] += 1
                name = f"{seq[(theme, cls)]:04d}--{slug}--{variant}.png"
                outdir = os.path.join(COMP, theme, cls)
                os.makedirs(outdir, exist_ok=True)
                out = os.path.join(outdir, name)
                crop.save(out, optimize=True)
                one = os.path.join(COMP, theme, "_1x", cls)
                os.makedirs(one, exist_ok=True)
                crop.resize((max(1, crop.width // 2), max(1, crop.height // 2)),
                            Image.LANCZOS).save(os.path.join(one, name), optimize=True)

                h_ = ahash(crop)
                bg, fg, ac = style_tokens(crop)
                # canonical 用「粗签名」：类别 + 基础角色 + 高度档 + 填充色档
                def q(hx, step=16):
                    r, g, b = (int(hx[i:i + 2], 16) for i in (1, 3, 5))
                    return tuple((v // step) * step for v in (r, g, b))
                hb = int(round(crop.height / 4.0) * 2)  # 2pt 对齐
                key = (theme, cls, base, hb, q(bg))
                if key not in canon:
                    cdir = os.path.join(COMP, "canonical", theme, cls)
                    os.makedirs(cdir, exist_ok=True)
                    cpath = os.path.join(cdir, f"{base}--h{hb:03d}--{h_[:6]}.png")
                    crop.save(cpath, optimize=True)
                    canon[key] = cpath
                canon_meta[key].append((base, f"{slug}/{step}", theme))

                man_rows.append({
                    "theme": theme, "class": cls, "role": role, "variant": variant,
                    "app": slug, "step": step, "w": crop.width, "h": crop.height,
                    "pt_h": round(crop.height / 2, 1), "ahash": h_,
                    "file": os.path.relpath(out, ROOT),
                    "canonical": os.path.relpath(canon[key], ROOT),
                })
                tok_rows.append({
                    "theme": theme, "class": cls, "role": role, "variant": variant,
                    "app": slug, "pt_w": round(crop.width / 2, 1),
                    "pt_h": round(crop.height / 2, 1), "bg": bg, "fg": fg, "accent": ac,
                    "file": os.path.relpath(out, ROOT),
                })
        print(f"[{theme}] 切片完成")

    with open(os.path.join(COMP, "manifest.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(man_rows[0].keys()) if man_rows else ["theme"])
        w.writeheader()
        w.writerows(man_rows)
    with open(os.path.join(COMP, "tokens.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(tok_rows[0].keys()) if tok_rows else ["theme"])
        w.writeheader()
        w.writerows(tok_rows)

    with open(os.path.join(COMP, "canonical.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["class", "variant", "theme", "ahash", "count", "file", "sources"])
        for key, members in sorted(canon_meta.items(), key=lambda kv: (kv[0][0], -len(kv[1]))):
            theme_, cls, base, hb, _bg = key
            srcs = sorted({m[1].split("/")[0] for m in members})
            w.writerow([cls, base, theme_, f"h{hb}", len(members),
                        os.path.relpath(canon[key], ROOT),
                        ";".join(srcs[:10])])

    # 屏幕链路重建：unique 组件数
    uniq = len(canon)
    print(f"组件切片 {len(man_rows)} 张 → 去重后 {uniq} 种")
    return len(man_rows), uniq


if __name__ == "__main__":
    main()
