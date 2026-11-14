#!/usr/bin/env python3
"""Figma 原始文档树的压缩/还原。

`figma/reference/_raw/*.json` 是 pull.py 拉下来的完整 Figma 文档树（96MB，两个文件）。
它们是纯 JSON，键名高度重复，zstd -19 能压到 **1.3MB（1.4%）**，而且完全可逆。

用法：
    python3 figma/tools/raw-pack/rawpack.py pack       # 打包 → figma/raw-archive/_raw.tar.zst
    python3 figma/tools/raw-pack/rawpack.py restore    # 还原 → figma/reference/_raw/
    python3 figma/tools/raw-pack/rawpack.py verify     # 只比对，确认包和现有原件一致

压缩比参考（macos27-file.json，43MB）：zstd -19 → 598KB，zstd -22 → 552KB，
xz -9e → 560KB。zstd -19 快 5 倍且只差 8%，所以用它。
"""
from __future__ import annotations

import argparse
import glob
import hashlib
import os
import shutil
import subprocess
import sys
import tarfile

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
RAW = os.path.join(REPO, "figma", "reference", "_raw")
ARCHIVE = os.path.join(REPO, "figma", "raw-archive", "_raw.tar.zst")


def sha256(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def readable_size(n: int) -> str:
    return f"{n / 1e6:.1f}MB"


def pack() -> None:
    files = sorted(glob.glob(os.path.join(RAW, "*.json")))
    if not files:
        sys.exit(f"{RAW} 里没有 .json，没什么可打包的")
    before = sum(os.path.getsize(p) for p in files)
    os.makedirs(os.path.dirname(ARCHIVE), exist_ok=True)
    tar = ARCHIVE[: -len(".zst")]
    subprocess.run(["tar", "-C", RAW, "-cf", tar, "."], check=True)
    subprocess.run(["zstd", "-19", "-q", "-f", tar, "-o", ARCHIVE], check=True)
    os.remove(tar)
    after = os.path.getsize(ARCHIVE)
    print(f"{len(files)} 个文件 {readable_size(before)} → {readable_size(after)} ({after / before * 100:.2f}%) → {ARCHIVE}")


def extract(dest: str) -> None:
    if not os.path.exists(ARCHIVE):
        sys.exit(f"没有压缩包: {ARCHIVE}（先跑 pack）")
    os.makedirs(dest, exist_ok=True)
    subprocess.run(["tar", "--zstd", "-xf", ARCHIVE, "-C", dest], check=True)


def restore() -> None:
    if glob.glob(os.path.join(RAW, "*.json")):
        print(f"{RAW} 里已经有原件，跳过。要覆盖先移走。")
        return
    os.makedirs(RAW, exist_ok=True)
    extract(RAW)
    n = len(glob.glob(os.path.join(RAW, "*.json")))
    print(f"已还原 {n} 个 JSON → {RAW}（{readable_size(sum(os.path.getsize(p) for p in glob.glob(os.path.join(RAW, '*.json'))))}）")


def verify() -> None:
    files = sorted(glob.glob(os.path.join(RAW, "*.json")))
    if not files:
        sys.exit(f"{RAW} 里没有原件，无法比对；先 restore 再 verify")
    tmp = "/tmp/raw-pack-verify"
    shutil.rmtree(tmp, ignore_errors=True)
    extract(tmp)
    bad = 0
    for orig in files:
        name = os.path.basename(orig)
        cand = os.path.join(tmp, ".", name)
        if not os.path.exists(cand) or sha256(orig) != sha256(cand):
            bad += 1
            print(f"不一致: {name}", file=sys.stderr)
    print(f"逐字节比对: 一致 {len(files) - bad}, 不一致 {bad}")
    shutil.rmtree(tmp, ignore_errors=True)
    sys.exit(1 if bad else 0)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument("action", choices=["pack", "restore", "verify"])
    args = ap.parse_args()
    {"pack": pack, "restore": restore, "verify": verify}[args.action]()


if __name__ == "__main__":
    main()
