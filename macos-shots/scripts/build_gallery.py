#!/usr/bin/env python3
"""生成组件库画廊（HTML）+ 供快速检查的组件拼图（PNG）。"""
import csv
import html
import os
from collections import defaultdict

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COMP = os.path.join(ROOT, "components")
REVIEW = os.path.join(ROOT, "_review")

CLASS_LABEL = {
    "01-navigation": "导航（侧栏项 / 标签组 / 展开箭头）",
    "02-button": "按钮（文字按钮 / 图标按钮 / 工具栏按钮）",
    "03-input": "输入（搜索框 / 文本框 / 下拉框）",
    "04-menu": "菜单（菜单栏项 / 下拉项 / 菜单面板）",
    "05-list": "列表（行 / 表格行 / 单元）",
    "06-control": "控件（开关 / 分段 / 滑块 / 勾选）",
    "07-feedback": "反馈（进度 / 等级）",
    "08-layout": "布局（工具栏 / 分栏 / 窗口骨架）",
}


def font(size):
    for p in ["/System/Library/Fonts/PingFang.ttc", "/System/Library/Fonts/Helvetica.ttc"]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size, index=0)
            except Exception:
                pass
    return ImageFont.load_default()


def read_csv(name):
    p = os.path.join(COMP, name)
    return list(csv.DictReader(open(p, encoding="utf-8"))) if os.path.exists(p) else []


def montage_class(cls, per_row=12, max_items=72, bg=(18, 18, 20)):
    rows = [dict(r, h="60", theme=r.get("theme", "dark"))
            for r in read_csv("canonical.csv") if r["class"] == cls and r.get("theme") == "dark"]
    if not rows:
        return None
    # 按高度分组，同高并排
    rows.sort(key=lambda r: (int(r["h"]), r["variant"]))
    picked, n = [], 0
    for r in rows:
        p = os.path.join(ROOT, r["file"])
        if not os.path.exists(p):
            continue
        picked.append((r, Image.open(p).convert("RGB")))
        n += 1
        if n >= max_items:
            break
    pad = 10
    x = y = pad
    rowh = 0
    layout = []
    for r, im in picked:
        im = im.copy()
        if im.height > 90:
            im = im.resize((max(1, int(im.width * 90 / im.height)), 90), Image.LANCZOS)
        if x + im.width + pad > 1700:
            x = pad
            y += rowh + pad + 16
            rowh = 0
        layout.append((x, y, r, im))
        x += im.width + pad
        rowh = max(rowh, im.height)
    H = y + rowh + pad + 16
    out = Image.new("RGB", (1700, H), bg)
    d = ImageDraw.Draw(out)
    f = font(12)
    for x, y, r, im in layout:
        out.paste(im, (x, y))
        d.text((x, y + im.height + 2), r["variant"][:16], font=f, fill=(150, 190, 240))
    os.makedirs(REVIEW, exist_ok=True)
    p = os.path.join(REVIEW, f"atoms-{cls}.png")
    out.save(p, optimize=True)
    return p


def build_html():
    man = read_csv("manifest.csv")
    canon = read_csv("canonical.csv")
    tok = read_csv("tokens.csv")
    by_class = defaultdict(list)
    for r in canon:
        by_class[r["class"]].append(r)
    parts = ["""<!doctype html><meta charset="utf-8">
<title>macOS 组件库（归一化）</title>
<style>
:root{color-scheme:dark light}
body{margin:0;padding:22px 28px;font:13px/1.5 -apple-system,"PingFang SC",sans-serif;background:#0e0e10;color:#e8e8e8}
h1{font-size:21px;margin:0 0 6px}h2{font-size:15px;margin:26px 0 12px;color:#8fc7ff}
h3{font-size:13px;margin:16px 0 8px;color:#bbb}
.meta{color:#888;margin-bottom:16px}code{color:#9ad}
.grid{display:flex;flex-wrap:wrap;gap:8px;align-items:flex-end}
figure{margin:0;background:#17171a;border:1px solid #26262b;border-radius:6px;padding:6px}
figure img{display:block;max-height:52px;max-width:260px}
figcaption{font-size:10px;color:#8ab;margin-top:4px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
table{border-collapse:collapse;font-size:11px;margin-top:8px}
td,th{border:1px solid #26262b;padding:3px 7px;text-align:left}th{color:#8fc7ff}
</style>"""]
    parts.append("<h1>macOS 组件库</h1>")
    te = defaultdict(int)
    for r in man:
        te[r["theme"]] += 1
    parts.append(f'<div class="meta">切片 {len(man)} 张（深色 {te.get("dark",0)} / 浅色 {te.get("light",0)}）· '
                 f'去重归组 {len(canon)} 组 · 样式测量 {len(tok)} 行 · '
                 f'原始整窗截图在 <code>shots/</code>，元数据在 <code>components/manifest.csv</code></div>')

    for cls in sorted(by_class):
        rows = sorted(by_class[cls], key=lambda r: -int(r["count"]))
        parts.append(f"<h2>{cls} {html.escape(CLASS_LABEL.get(cls,''))}")
        parts.append(f"<h3>{len(rows)} 组 · 按被使用次数排序</h3><div class='grid'>")
        for r in rows[:80]:
            img = os.path.join(ROOT, r["file"])
            rel = os.path.relpath(img, ROOT)
            parts.append(
                f"<figure><img src='../{rel}' loading='lazy' title='{html.escape(r['sources'])}'>"
                f"<figcaption>{html.escape(r['variant'])} · {r['ahash']} · ×{r['count']}</figcaption></figure>")
        parts.append("</div>")
    out = os.path.join(COMP, "index.html")
    open(out, "w", encoding="utf-8").write("\n".join(parts))
    return out


if __name__ == "__main__":
    for cls in sorted(CLASS_LABEL):
        p = montage_class(cls)
        if p:
            print("atoms:", os.path.relpath(p, ROOT))
    print("html:", os.path.relpath(build_html(), ROOT))
