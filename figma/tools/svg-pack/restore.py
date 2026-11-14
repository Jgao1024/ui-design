#!/usr/bin/env python3
"""从无损包还原原始 SVG（逐字节）。

包里存的位图是原始 PNG 字节, SVG 除了 `../img/<hash>.png` 之外没被改过,
所以把引用内联回 `data:image/png;base64,...` 就得到原始文件。

用法：
    python3 figma/tools/svg-pack/restore.py --verify     # 和现有原件比对，不写盘
    python3 figma/tools/svg-pack/restore.py              # 写回 figma/reference/<kit>/svg/
    python3 figma/tools/svg-pack/restore.py --dest /tmp/x

还原规则: 包里 `.jpg` 对应原始 MIME 是 `image/jpeg`（不是 `image/jpg`）。
"""
from __future__ import annotations

import argparse
import base64
import glob
import os
import re
import shutil
import subprocess
import sys
import tempfile

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
SRC_DEFAULT = os.path.join(REPO, "figma", "svg-packed")
DEST_DEFAULT = os.path.join(REPO, "figma", "reference")

REF = re.compile(rb"\.\./img/([0-9a-f]{16})\.(png|jpg)")
MIME = {b"png": b"png", b"jpg": b"jpeg"}


def restore_archive(pkg: str, dest: str, verify: bool) -> tuple[int, int, int]:
    """还原一个包，返回 (写入数, 一致数, 不一致数)。"""
    name = os.path.basename(pkg).removesuffix(".tar.zst")
    kit, cat = name.split("-", 1)
    out_dir = os.path.join(dest, kit, "svg", cat)
    written = same = diff = 0

    with tempfile.TemporaryDirectory(prefix="svg-restore-") as tmp:
        subprocess.run(["tar", "--zstd", "-xf", pkg, "-C", tmp], check=True)
        for src in sorted(glob.glob(os.path.join(tmp, "svg", "*.svg"))):
            data = open(src, "rb").read()

            def inline(m: re.Match[bytes], root=tmp) -> bytes:
                img = os.path.join(root, "img", m.group(1).decode() + "." + m.group(2).decode())
                raw = open(img, "rb").read()
                return b"data:image/" + MIME[m.group(2)] + b";base64," + base64.b64encode(raw)

            rebuilt = REF.sub(inline, data)
            target = os.path.join(out_dir, os.path.basename(src))
            if verify:
                if os.path.exists(target):
                    if open(target, "rb").read() == rebuilt:
                        same += 1
                    else:
                        diff += 1
                        print(f"不一致: {target}", file=sys.stderr)
                else:
                    diff += 1
                    print(f"缺原件: {target}", file=sys.stderr)
                continue
            os.makedirs(out_dir, exist_ok=True)
            with open(target, "wb") as f:
                f.write(rebuilt)
            written += 1
    return written, same, diff


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("--src", default=SRC_DEFAULT, help="包目录（默认 figma/svg-packed）")
    ap.add_argument("--dest", default=DEST_DEFAULT, help="还原目标（默认 figma/reference）")
    ap.add_argument("--verify", action="store_true", help="只和现有原件比对，不写盘")
    args = ap.parse_args()

    packages = sorted(glob.glob(os.path.join(args.src, "*.tar.zst")))
    if not packages:
        sys.exit(f"{args.src} 里没有 .tar.zst")

    total_w = total_s = total_d = 0
    for pkg in packages:
        w, s, d = restore_archive(pkg, args.dest, args.verify)
        total_w += w; total_s += s; total_d += d
        print(f"{os.path.basename(pkg):<34} {'一致' if args.verify else '写入'} {s or w:>3}  不一致 {d}")

    if args.verify:
        print(f"\n逐字节比对: 一致 {total_s}, 不一致 {total_d}")
        sys.exit(1 if total_d else 0)
    print(f"\n已还原 {total_w} 个 SVG → {args.dest}")


if __name__ == "__main__":
    main()
