#!/usr/bin/env python3
"""Figma SVG 分类打包：抽出内嵌位图 → 去重 → 每个分类一个 tar.zst。

背景：figma/reference/<kit>/svg/<分类>/*.svg 共 686 个、281MB，其中 94% 是
Figma 以 base64 塞在 SVG 里的位图，2,626 次引用只对应 607 张唯一图。
把位图抽成 img/<sha1前16位>.<png|webp> 后，同一张图在分类内只存一份。

用法：
    python3 figma/tools/svg-pack/pack.py --mode lossless   # → figma/svg-packed/
    python3 figma/tools/svg-pack/pack.py --mode webp       # → figma/svg-packed-webp/

产物结构（每个分类一个包）：
    <kit>-<分类>.tar.zst
        svg/<原文件名>.svg      位图引用改成 ../img/<hash>.<ext>
        img/<hash>.<png|webp>   该分类用到的唯一位图

解包见 figma/tools/svg-pack/unpack.sh，说明见 docs/svg-pack.md。
"""
from __future__ import annotations

import argparse
import base64
import glob
import hashlib
import io
import os
import re
import shutil
import subprocess

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
REF = os.path.join(REPO, "figma", "reference")

# data:image/png;base64,AAAA...
DATA_URI = re.compile(rb"data:image/(png|jpeg|jpg);base64,([A-Za-z0-9+/=]+)")

MODES = {
    "lossless": ("figma/svg-packed", "png", None),
    "webp": ("figma/svg-packed-webp", "webp", 82),
}


def b64decode(raw: bytes) -> bytes:
    return base64.b64decode(raw + b"=" * ((4 - len(raw) % 4) % 4))


def write_image(path: str, raw: bytes, ext: str, quality: int | None) -> None:
    data = b64decode(raw)
    if ext == "png":
        with open(path, "wb") as f:
            f.write(data)
        return
    from PIL import Image

    im = Image.open(io.BytesIO(data))
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA")
    im.save(path, "WEBP", quality=quality, method=4)


def pack_category(kit: str, cat: str, svg_dir: str, work: str, out: str,
                  ext: str, quality: int | None) -> tuple[int, int, int]:
    """打包一个分类，返回 (原字节数, 包字节数, 唯一图数)。"""
    wd = os.path.join(work, kit, cat)
    shutil.rmtree(wd, ignore_errors=True)
    os.makedirs(os.path.join(wd, "svg"), exist_ok=True)
    os.makedirs(os.path.join(wd, "img"), exist_ok=True)

    original = 0
    images: dict[str, int] = {}

    for src in sorted(glob.glob(os.path.join(svg_dir, "*.svg"))):
        with open(src, "rb") as f:
            data = f.read()
        original += len(data)

        def replace(m: re.Match[bytes]) -> bytes:
            raw = m.group(2)
            digest = hashlib.sha1(raw).hexdigest()[:16]
            name = f"{digest}.{ext}"
            path = os.path.join(wd, "img", name)
            if name not in images:
                write_image(path, raw, ext, quality)
                images[name] = os.path.getsize(path)
            return b"../img/" + name.encode()

        with open(os.path.join(wd, "svg", os.path.basename(src)), "wb") as f:
            f.write(DATA_URI.sub(replace, data))

    tar = os.path.join(work, f"{kit}-{cat}.tar")
    with open(tar, "wb") as fh:
        subprocess.run(["tar", "-C", wd, "-cf", "-", "svg", "img"], stdout=fh, check=True)
    subprocess.run(["zstd", "-19", "-q", "-f", tar, "-o", out], check=True)
    os.remove(tar)
    return original, os.path.getsize(out), len(images)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--mode", choices=sorted(MODES), default="lossless")
    ap.add_argument("--out", help="输出目录（默认写进仓库 figma/svg-packed*）")
    ap.add_argument("--keep-work", action="store_true", help="保留下载前的临时 svg/img 目录")
    args = ap.parse_args()

    out_rel, ext, quality = MODES[args.mode]
    out_dir = args.out or os.path.join(REPO, out_rel)
    os.makedirs(out_dir, exist_ok=True)
    work = os.path.join("/tmp", f"svg-pack-{args.mode}")
    shutil.rmtree(work, ignore_errors=True)

    rows = []
    for kit in ("ios27", "macos27"):
        for svg_dir in sorted(glob.glob(os.path.join(REF, kit, "svg", "*"))):
            if not os.path.isdir(svg_dir):
                continue
            cat = os.path.basename(svg_dir)
            if not glob.glob(os.path.join(svg_dir, "*.svg")):
                continue
            out = os.path.join(out_dir, f"{kit}-{cat}.tar.zst")
            original, packed, unique = pack_category(kit, cat, svg_dir, work, out, ext, quality)
            rows.append((original, packed))
            print(f"{kit:7} {cat:<24} 原 {original / 1e6:6.1f}MB → {packed / 1e6:5.2f}MB  唯一图 {unique:>3}")

    total_in = sum(r[0] for r in rows) / 1e6
    total_out = sum(r[1] for r in rows) / 1e6
    print(f"\n合计 {total_in:.0f}MB → {total_out:.1f}MB ({total_out / total_in * 100:.1f}%)  → {out_dir}")
    if not args.keep_work:
        shutil.rmtree(work, ignore_errors=True)


if __name__ == "__main__":
    main()
