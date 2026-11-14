#!/usr/bin/env python3
"""生成 index.html 画廊 + 拼图（review 用）。"""
import csv
import html
import os
import sys
from collections import OrderedDict

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHOTS = os.path.join(ROOT, "shots")
REVIEW = os.path.join(ROOT, "_review")
THUMB_W = 560


def load_manifest(theme):
    path = os.path.join(ROOT, "logs", f"manifest-{theme}.csv")
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    # 同一 (slug, step) 只保留最后一次运行的结果
    latest = {}
    for r in rows:
        latest[(r["slug"], r["step"])] = r
    return list(latest.values())


def group(rows):
    g = OrderedDict()
    for r in rows:
        g.setdefault((r["slug"], r["app"]), []).append(r)
    return g


def font(size):
    for p in ["/System/Library/Fonts/PingFang.ttc",
              "/System/Library/Fonts/Helvetica.ttc"]:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size, index=0)
            except Exception:
                pass
    return ImageFont.load_default()


def montage(theme, max_row_w=2900):
    rows = load_manifest(theme)
    if not rows:
        return None
    g = group(rows)
    f_title, f_cap = font(22), font(17)
    panels = []
    for (slug, app), items in g.items():
        thumbs = []
        for it in items:
            p = os.path.join(ROOT, it["file"])
            if not os.path.exists(p):
                continue
            im = Image.open(p).convert("RGB")
            h = int(im.height * THUMB_W / im.width)
            thumbs.append((it["step"], im.resize((THUMB_W, h), Image.LANCZOS)))
        if not thumbs:
            continue
        rh = max(t.height for _, t in thumbs) + 46
        w = len(thumbs) * (THUMB_W + 12) + 12
        panel = Image.new("RGB", (w, rh), (24, 24, 26))
        d = ImageDraw.Draw(panel)
        d.text((10, 6), f"{slug}  {app}", font=f_title, fill=(240, 240, 240))
        x = 12
        for name, t in thumbs:
            panel.paste(t, (x, 34))
            d.text((x + 4, 34 + t.height + 4), name, font=f_cap, fill=(150, 200, 255))
            x += THUMB_W + 12
        panels.append(panel)
    if not panels:
        return None
    W = min(max_row_w, max(p.width for p in panels))
    ncol = max(1, W // panels[0].width) if panels[0].width <= W else 1
    # 简单纵向堆叠，超宽缩放
    total_h = sum(p.height + 14 for p in panels)
    out = Image.new("RGB", (W, total_h), (16, 16, 18))
    y = 0
    for p in panels:
        if p.width != W:
            p = p.resize((W, int(p.height * W / p.width)), Image.LANCZOS)
        out.paste(p, (0, y))
        y += p.height + 14
    os.makedirs(REVIEW, exist_ok=True)
    # 每 5 个应用切一页，便于翻看
    per = 5
    paths = []
    for i in range(0, len(panels), per):
        chunk = panels[i:i + per]
        h = sum(p.height + 14 for p in chunk)
        page = Image.new("RGB", (W, h), (16, 16, 18))
        y = 0
        for p in chunk:
            if p.width != W:
                p = p.resize((W, int(p.height * W / p.width)), Image.LANCZOS)
            page.paste(p, (0, y))
            y += p.height + 14
        path = os.path.join(REVIEW, f"montage-{theme}-{i//per+1}.png")
        page.save(path, optimize=True)
        paths.append(path)
    return paths


def build_html():
    themes = [t for t in ("dark", "light") if load_manifest(t)]
    parts = ["""<!doctype html><meta charset="utf-8">
<title>macOS 自带应用截图库</title>
<style>
:root{color-scheme:dark light}
body{margin:0;padding:24px 32px;font:14px/1.55 -apple-system,"PingFang SC",sans-serif;
     background:#111;color:#eee}
h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:34px 0 10px;
     color:#9ad;border-top:1px solid #2a2a2e;padding-top:16px}
.meta{color:#888;margin-bottom:18px}
.app{margin:0 0 22px}
.app h3{font-size:14px;margin:0 0 8px;color:#ddd;font-weight:600}
.app h3 span{color:#777;font-weight:400;margin-left:8px}
.strip{display:flex;gap:10px;flex-wrap:wrap}
figure{margin:0;background:#1a1a1d;border:1px solid #26262a;border-radius:8px;overflow:hidden}
figure img{display:block;width:340px;height:auto;background:#000}
figcaption{font-size:11px;color:#8ab;padding:5px 8px;display:flex;justify-content:space-between}
figcaption em{color:#666;font-style:normal}
</style>"""]
    parts.append("<h1>macOS 自带应用截图库</h1>")
    total = sum(len(load_manifest(t)) for t in themes)
    parts.append(f'<div class="meta">共 {total} 张 · 每个应用一个文件夹 · 只截窗口本身，不含桌面</div>')
    for theme in themes:
        rows = load_manifest(theme)
        parts.append(f"<h2>{'深色' if theme == 'dark' else '浅色'}模式 · {len(rows)} 张</h2>")
        for (slug, app), items in group(rows).items():
            parts.append('<div class="app">')
            parts.append(f'<h3>{html.escape(app)} <span>{slug}</span></h3><div class="strip">')
            for it in items:
                dup = " 重复" if it.get("duplicate_of") else ""
                parts.append(
                    f'<figure><a href="{it["file"]}"><img src="{it["file"]}" loading="lazy"></a>'
                    f'<figcaption>{html.escape(it["step"])}<em>{it["win_w"]}×{it["win_h"]}{dup}</em></figcaption></figure>')
            parts.append("</div></div>")
    out = os.path.join(ROOT, "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    return out


if __name__ == "__main__":
    for t in ("dark", "light"):
        for p in (montage(t) or []):
            print("montage:", os.path.relpath(p, ROOT))
    print("html:", os.path.relpath(build_html(), ROOT))
