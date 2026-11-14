#!/usr/bin/env python3
"""压掉 SVG 里内嵌的大位图。

Figma 导出会把画板上的图片原样 base64 内嵌进 SVG：一套 macOS 桌面壁纸 26 MB，
出现 15 次就是 390 MB。这些图在组件库里只需要「看得清」，不需要原始分辨率。

  壁纸 (Wallpaper-*, image.png 且不透明) → 最长边 1512，转 JPEG q75
  设备外框 (iPhone/iPad/MacBook)          → 最长边 768，保持 PNG（要透明）
  其余图标                                → 最长边 256，保持 PNG（要透明）

只替换 <image> 元素里的 payload 与 MIME，SVG 结构一个字节都不动。
需要 macOS 的 sips；找不到就原样返回，不会破坏数据。

单独跑（把一个已有目录全部压一遍）：
    python3 figma/tools/figma-pull/svg_shrink.py figma/reference
"""
from __future__ import annotations

import base64
import hashlib
import re
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

WALLPAPER_MAX = 1512
DEVICE_MAX = 768
ICON_MAX = 256
MIN_RAW_BYTES = 60 * 1024          # 小于这个的内嵌图不碰
QUALITY = 75

_IMAGE_TAG = re.compile(r"<image\b[^>]*?data-name=\"([^\"]*)\"[^>]*?>", re.S)
_DATA_URI = re.compile(r'xlink:href="data:image/([a-z]+);base64,([A-Za-z0-9+/=]+)"')

_sips = shutil.which("sips")
_cache: dict[str, tuple[str, str]] = {}      # 原图 md5 -> (mime, 新 base64)


def _png_has_alpha(raw: bytes) -> bool:
    if raw[:8] != b"\x89PNG\r\n\x1a\n" or len(raw) < 26:
        return False
    return raw[25] in (4, 6)                 # 灰度+alpha / RGBA


def _mime_and_target(name: str, raw: bytes) -> tuple[str, int]:
    wallpaper = name.startswith("Wallpaper") or name == "image.png"
    if wallpaper and not _png_has_alpha(raw):
        return "jpeg", WALLPAPER_MAX
    if ("iPhone" in name) or ("iPad" in name) or ("MacBook" in name):
        return "png", DEVICE_MAX
    return "png", ICON_MAX


def _convert(raw: bytes, mime: str, target: int) -> str:
    tmp = Path(tempfile.mkdtemp(prefix="svgshrink_"))
    try:
        src = tmp / "in.png"
        src.write_bytes(raw)
        dst = tmp / ("out.jpg" if mime == "jpeg" else "out.png")
        cmd = ["sips", "-Z", str(target), str(src), "--out", str(dst)]
        if mime == "jpeg":
            cmd = ["sips", "-Z", str(target), "--setProperty", "format", "jpeg",
                   "--setProperty", "formatOptions", str(QUALITY), str(src), "--out", str(dst)]
        r = subprocess.run(cmd, capture_output=True)
        if r.returncode != 0 or not dst.exists():
            return ""
        return base64.b64encode(dst.read_bytes()).decode()
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def shrink_svg(svg: str) -> tuple[str, int, int]:
    """返回 (新内容, 原字节数, 新字节数)。没有可压的图就原样返回。"""
    if not _sips or "data:image/png;base64," not in svg:
        return svg, len(svg), len(svg)

    def fix(m: re.Match) -> str:
        tag, name = m.group(0), m.group(1)
        d = _DATA_URI.search(tag)
        if not d or d.group(1) != "png":
            return tag
        b64 = d.group(2)
        if len(b64) * 3 // 4 < MIN_RAW_BYTES:
            return tag
        raw = base64.b64decode(b64)
        digest = hashlib.md5(raw).hexdigest()
        hit = _cache.get(digest)
        if hit is None:
            mime, target = _mime_and_target(name, raw)
            new = _convert(raw, mime, target)
            hit = (mime, new) if new else ("", "")
            _cache[digest] = hit
        mime, new = hit
        if not new:
            return tag
        return tag.replace(d.group(0), f'xlink:href="data:image/{mime};base64,{new}"')

    out = _IMAGE_TAG.sub(fix, svg)
    return out, len(svg), len(out)


def shrink_tree(root: Path) -> None:
    files = sorted(root.rglob("*.svg"))
    n = saved = 0
    for f in files:
        old = f.read_text(encoding="utf-8", errors="replace")
        new, b, a = shrink_svg(old)
        if new != old:
            f.write_text(new, encoding="utf-8", errors="replace")
            n += 1
            saved += b - a
    print(f"压缩 {n} / {len(files)} 个 SVG，减少 {saved / 1024 / 1024:,.0f} MB")


if __name__ == "__main__":
    shrink_tree(Path(sys.argv[1] if len(sys.argv) > 1 else "figma/reference"))
