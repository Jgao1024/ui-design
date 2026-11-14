#!/usr/bin/env python3
"""Turn Figma's per-page export zips into the same reference/ tree the plugin produces.

Workflow this supports (browser only, no desktop app, no quota):
  Figma 里对每个页面 ⌘A → Export → SVG → 下载得到一个 zip
  → 全部堆在 ~/Downloads → 跑本脚本，按导出顺序自动对应到页面并分类归档

Zips are matched to pages by creation time, so you do NOT have to rename anything:
just export the pages in the order the script prints.

  python3 tools/ingest-zips.py --kit macos27 --list
  python3 tools/ingest-zips.py --kit macos27 --src ~/Downloads --dry-run
  python3 tools/ingest-zips.py --kit macos27 --src ~/Downloads
"""

from __future__ import annotations

import argparse
import json
import sys
import time
import zipfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "figma-pull"))
from taxonomy import SKIP_BUCKETS, bucket_for, slug  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "Figma"        # Figma 抓取数据与工具


def ordered_pages(kit: str) -> list[str]:
    """Pages of one kit, in document order, minus cover/examples/license separators."""
    raw = DATA / "reference" / "_raw" / f"{kit}-file.json"
    if not raw.exists():
        raise SystemExit(f"missing {raw.relative_to(ROOT)}")
    doc = json.loads(raw.read_text())
    pages = []
    for page in doc["document"].get("children") or ():
        name = (page.get("name") or "").strip()
        if not name or page.get("children") is None:
            continue
        if set(name) <= set("-—"):
            continue
        if bucket_for(name) in SKIP_BUCKETS:
            continue
        pages.append(name)
    return pages


def zips_in(src: Path) -> list[Path]:
    return sorted(src.glob("*.zip"), key=lambda p: p.stat().st_birthtime if hasattr(p.stat(), "st_birthtime") else p.stat().st_ctime)


def svg_entries(z: Path) -> list[tuple[str, bytes]]:
    """Return (component name, svg bytes). Keeps inner folders, drops the wrapper
    folder Figma adds ('images/' etc.) so grouped variants stay grouped."""
    out = []
    with zipfile.ZipFile(z) as zf:
        for info in zf.infolist():
            if info.is_dir() or not info.filename.lower().endswith(".svg"):
                continue
            parts = [p for p in Path(info.filename).parts if p not in (".", "")]
            if parts and parts[0].lower() in ("images", "export", "svg", "assets"):
                parts = parts[1:]
            if not parts:
                continue
            stem = "/".join(parts[:-1] + [Path(parts[-1]).stem])
            out.append((stem, zf.read(info)))
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--kit", required=True)
    ap.add_argument("--src", default=str(Path.home() / "Downloads"))
    ap.add_argument("--list", action="store_true", help="print the page order, do nothing")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--start", type=int, default=1, help="1-based page index to start at")
    args = ap.parse_args()

    pages = ordered_pages(args.kit)
    if args.list:
        print(f"{args.kit}: {len(pages)} 页，按这个顺序导出（zip 会被按创建时间配对）：\n")
        for i, p in enumerate(pages, 1):
            print(f"  {i:2d}. {p}  →  {bucket_for(p)}/")
        return 0

    zips = zips_in(Path(args.src).expanduser())
    if not zips:
        raise SystemExit(f"{args.src} 里没有 zip")

    todo = pages[args.start - 1:]
    print(f"页面 {len(todo)} 个（从第 {args.start} 页起）, zip {len(zips)} 个")
    if len(zips) > len(todo):
        print(f"! 多出 {len(zips) - len(todo)} 个 zip，按顺序只取前 {len(todo)} 个")

    pairs = list(zip(todo, zips))
    if len(zips) < len(todo):
        print(f"! zip 比页面少 {len(todo) - len(zips)} 个 —— 只处理能配对的，剩下的导出后再跑一次")

    seen: dict[str, int] = {}
    total = 0
    for page, z in pairs:
        bucket = bucket_for(page)
        items = svg_entries(z)
        print(f"  {z.name:28} → {page:28} {len(items):4d} 个 → {bucket}/")
        if args.dry_run:
            for name, _ in items[:3]:
                print(f"        · {name}")
            continue

        folder = DATA / "reference" / args.kit / "svg" / bucket
        folder.mkdir(parents=True, exist_ok=True)
        for name, data in items:
            key = f"{slug(page)}__{slug(name)}"
            seen[key] = seen.get(key, 0) + 1
            fname = f"{key}.svg" if seen[key] == 1 else f"{key}-{seen[key]}.svg"
            (folder / fname).write_bytes(data)
            with open(DATA / "reference" / args.kit / "svg" / "_received.jsonl", "a") as fh:
                fh.write(json.dumps({
                    "id": None, "name": name, "type": None, "page": page,
                    "bucket": bucket, "file": f"svg/{bucket}/{fname}",
                }, ensure_ascii=False) + "\n")
            total += 1

    if args.dry_run:
        print("\n(dry run: 没有写文件)")
        return 0

    print(f"\n写入 {total} 个 SVG")
    try:
        from receiver import build_index
        for kit in {args.kit}:
            print("索引:", build_index(kit))
    except Exception as e:                      # noqa: BLE001
        print(f"(索引生成跳过: {e})")
    print("done", time.strftime("%H:%M:%S"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
