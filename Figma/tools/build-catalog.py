#!/usr/bin/env python3
"""Join the three layers into one catalog.

  reference/_raw/<kit>-file.json   full document tree (authoritative)
  reference/<kit>/specs/**/*.json  parameters per component (geometry, colors, type)
  reference/<kit>/svg/**/*.svg     exported vectors

Output:
  reference/catalog.json           machine readable
  reference/CATALOG.md             cross-platform tables

Usage: python3 tools/build-catalog.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "figma-pull"))
from taxonomy import SKIP_BUCKETS, bucket_for  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
DATA = ROOT / "Figma"        # Figma 抓取数据与工具
KITS = ("macos27", "ios27")


def masters_of(kit: str) -> list[dict]:
    raw = DATA / "reference" / "_raw" / f"{kit}-file.json"
    if not raw.exists():
        return []
    doc = json.loads(raw.read_text())
    out: list[dict] = []

    def rec(node: dict, page: str) -> None:
        for c in node.get("children") or ():
            t = c.get("type")
            if t in ("COMPONENT_SET", "COMPONENT"):
                b = c.get("absoluteBoundingBox") or {}
                out.append({
                    "id": c.get("id"), "name": (c.get("name") or "").strip(),
                    "page": page, "bucket": bucket_for(page), "type": t,
                    "w": round(b.get("width") or 0), "h": round(b.get("height") or 0),
                    "variants": len(c.get("children") or ()) if t == "COMPONENT_SET" else 0,
                })
                continue
            rec(c, page)

    for page in doc.get("document", {}).get("children") or ():
        name = (page.get("name") or "").strip()
        if bucket_for(name) in SKIP_BUCKETS:
            continue
        rec(page, name)
    return out


def svg_index(kit: str) -> tuple[dict, dict]:
    """(page, name) -> [files] for masters, plus a flat name index for split parts."""
    base = DATA / "reference" / kit / "svg" / "MANIFEST.json"
    if not base.exists():
        return {}, {}
    items = json.loads(base.read_text()).get("items") or []
    exact: dict[tuple[str, str], list[str]] = {}
    flat: dict[tuple[str, str], list[str]] = {}      # page-scoped: same name on two pages must not mix
    for it in items:
        page, name, f = it.get("page") or "", it.get("name") or "", it.get("file") or ""
        exact.setdefault((page, name), []).append(f)
        flat.setdefault((page, name), []).append(f)
    return exact, flat


def spec_index(kit: str) -> dict[tuple[str, str], str]:
    out: dict[tuple[str, str], str] = {}
    base = DATA / "reference" / kit / "specs"
    if not base.exists():
        return out
    for p in base.rglob("*.json"):
        try:
            d = json.loads(p.read_text())
        except Exception:  # noqa: BLE001
            continue
        out[(d.get("page") or "", (d.get("component") or "").strip())] = str(p.relative_to(DATA / "reference"))
    return out


def build(kit: str) -> dict:
    ms = masters_of(kit)
    exact_svg, flat_svg = svg_index(kit)
    specs = spec_index(kit)
    # Match per master. Same-named masters on one page legitimately share split files,
    # so the catalog is an index (counts may overlap), not a partition.
    matched: dict[int, list[str]] = {}
    for i, m in enumerate(ms):
        # exact file + any split children ("Master / Child"); union, not either/or --
        # two masters can share a name, one of them plus its parts.
        own = list(exact_svg.get((m["page"], m["name"]), []))
        own += [f for (pg, n), fs in flat_svg.items()
                if pg == m["page"] and n.startswith(m["name"] + " / ") for f in fs]
        matched[i] = sorted(set(own))

    all_files = {f for fs in exact_svg.values() for f in fs}
    touched = {f for fs in matched.values() for f in fs}
    orphans = sorted(all_files - touched)

    rows = []
    for i, m in enumerate(ms):
        spec = specs.get((m["page"], m["name"]))
        rows.append({**m, "svg": matched[i], "spec": spec})
    return {
        "kit": kit,
        "masters": len(rows),
        "with_svg": sum(1 for r in rows if r["svg"]),
        "with_spec": sum(1 for r in rows if r["spec"]),
        "svg_files": sum(len(r["svg"]) for r in rows),
        "svg_all": len(all_files),
        "orphans": orphans,
        "rows": rows,
    }


def md_table(rows: list[dict], kit: str) -> list[str]:
    out = ["| 组件 | 页面 | 类型 | 尺寸 | 变体 | SVG | 参数 |", "|---|---|---|---|---|---|---|"]
    for r in rows:
        size = f'{r["w"]}×{r["h"]}' if r["w"] and r["h"] else "—"
        svg = f'[{len(r["svg"])}]({kit}/{r["svg"][0]})' if r["svg"] else "—"
        spec = f'[{Path(r["spec"]).name}]({r["spec"]})' if r["spec"] else "—"
        out.append(f'| {r["name"]} | {r["page"]} | {r["type"]} | {size} | '
                   f'{r["variants"] or "—"} | {svg} | {spec} |')
    return out


def main() -> int:
    data = {k: build(k) for k in KITS}
    (DATA / "reference" / "catalog.json").write_text(json.dumps(data, ensure_ascii=False, indent=2))

    lines = ["# 组件总表（macOS 27 + iOS 27）", ""]
    lines += ["| 平台 | 主组件 | 有 SVG | 有参数 | 磁盘 SVG | 未归属 |", "|---|---|---|---|---|---|"]
    for k, d in data.items():
        lines.append(f'| {k} | {d["masters"]} | {d["with_svg"]} | {d["with_spec"]} | '
                     f'{d["svg_all"]} | {len(d["orphans"])} |')
    lines += ["", "> 同页同名组件的拆分文件会被合并计数，因此上表「磁盘 SVG」是去重后的真实文件数。", ""]
    lines.append("")

    for k, d in data.items():
        lines += [f"# {k}", ""]
        by_bucket: dict[str, list[dict]] = {}
        for r in d["rows"]:
            by_bucket.setdefault(r["bucket"], []).append(r)
        for b in sorted(by_bucket):
            rows = sorted(by_bucket[b], key=lambda r: (r["page"], r["name"].lower()))
            lines += [f"## {b} ({len(rows)})", ""] + md_table(rows, k) + [""]

    lines += ["# 未归属文件", "",
              "这些 SVG 没有匹配到任何主组件名（通常是同页同名组件的拆分块），内容完整，只是无法归到单一组件。", ""]
    for k, d in data.items():
        if not d["orphans"]:
            continue
        lines += [f"## {k} ({len(d['orphans'])})", ""]
        for f in d["orphans"]:
            lines.append(f'- [{Path(f).name}]({k}/{f})')
        lines.append("")

    (DATA / "reference" / "CATALOG.md").write_text("\n".join(lines))
    for k, d in data.items():
        print(f'{k}: {d["masters"]} masters, {d["with_svg"]} with svg, '
              f'{d["with_spec"]} with spec, {d["svg_files"]} svg files')
    print("wrote reference/catalog.json + reference/CATALOG.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
