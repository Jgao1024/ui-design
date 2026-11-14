#!/usr/bin/env python3
"""Extract every design parameter from a cached Figma document tree.

Nothing is thrown away at the source: reference/_raw/<kit>-file.json is the full
document. This script turns it into queryable artifacts:

  reference/<kit>/specs/<bucket>/<page>__<name>.json   per-component parameters
  reference/<kit>/tokens/colors.json                   every unique paint
  reference/<kit>/tokens/typography.json                every unique text style
  reference/<kit>/tokens/effects.json                   every unique effect (blur/shadow)
  reference/<kit>/tokens/geometry.json                  radii / sizes / spacing
  reference/<kit>/index.md + MANIFEST.json

Usage: python3 tools/figma-pull/extract.py --kit macos27
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "figma"        # Figma 抓取数据与工具

# Page name -> bucket. Explicit beats keyword guessing for Apple kits.
import sys as _sys
_sys.path.insert(0, str(Path(__file__).resolve().parent))
from taxonomy import bucket_for, slug  # noqa: E402  (single source of truth)

SKIP_BUCKETS = {"00-meta"}


# --- color / paint -----------------------------------------------------------
def hexof(c: dict) -> str:
    def ch(v: float) -> int:
        return max(0, min(255, round(v * 255)))
    return f"#{ch(c.get('r', 0)):02X}{ch(c.get('g', 0)):02X}{ch(c.get('b', 0)):02X}"


def norm_paint(p: dict) -> dict:
    t = p.get("type")
    c = p.get("color") or {}
    alpha = round(c.get("a", 1.0) * p.get("opacity", 1.0), 4)
    out = {
        "type": t,
        "hex": hexof(c) if c else None,
        "alpha": alpha,
        "visible": p.get("visible", True),
        "blendMode": p.get("blendMode"),
    }
    if t and t.startswith("GRADIENT") or t == "GRADIENT_LINEAR":
        out["gradientStops"] = [
            {"position": s.get("position"), "hex": hexof(s.get("color") or {}),
             "alpha": round((s.get("color") or {}).get("a", 1), 4)}
            for s in p.get("gradientStops") or ()
        ]
        out["gradientHandlePositions"] = p.get("gradientHandlePositions")
    if t == "IMAGE":
        out["imageRef"] = p.get("imageRef")
        out["scaleMode"] = p.get("scaleMode")
    if p.get("boundVariables"):
        out["boundVariables"] = p["boundVariables"]
    if p.get("styles"):
        out["styles"] = p["styles"]
    return out


def norm_effect(e: dict) -> dict:
    out = {"type": e.get("type"), "visible": e.get("visible", True)}
    for k in ("radius", "spread", "blurType", "showShadowBehindNode"):
        if e.get(k) is not None:
            out[k] = e[k]
    if e.get("color"):
        out["hex"] = hexof(e["color"])
        out["alpha"] = round(e["color"].get("a", 1), 4)
    if e.get("offset"):
        out["offset"] = {"x": e["offset"].get("x"), "y": e["offset"].get("y")}
    return out


def norm_style_text(st: dict | None) -> dict | None:
    if not st:
        return None
    keep = ("fontFamily", "fontPostScriptName", "fontWeight", "fontSize",
            "textAlignHorizontal", "textAlignVertical", "letterSpacing",
            "lineHeightPx", "lineHeightPercentFontSize", "lineHeightUnit",
            "textCase", "textDecoration", "paragraphSpacing", "paragraphIndent")
    return {k: st[k] for k in keep if st.get(k) is not None}


def type_key(st: dict) -> str:
    return (f"{st.get('fontFamily')}/{st.get('fontWeight')}/{st.get('fontSize')}"
            f"/{round(st.get('lineHeightPx') or 0, 1)}"
            f"/{round(st.get('letterSpacing') or 0, 2)}")


# --- node -> spec ------------------------------------------------------------
def node_spec(n: dict, *, deep_text: bool = False) -> dict:
    bbox = n.get("absoluteBoundingBox") or {}
    spec: dict = {
        "id": n.get("id"),
        "name": n.get("name"),
        "type": n.get("type"),
        "bbox": {k: bbox.get(k) for k in ("x", "y", "width", "height")} if bbox else None,
        "opacity": n.get("opacity"),
        "visible": n.get("visible", True),
        "blendMode": n.get("blendMode"),
        "cornerRadius": n.get("cornerRadius"),
        "rectangleCornerRadii": n.get("rectangleCornerRadii"),
        "layoutMode": n.get("layoutMode"),
        "itemSpacing": n.get("itemSpacing"),
        "counterAxisSpacing": n.get("counterAxisSpacing"),
        "paddingLeft": n.get("paddingLeft"),
        "paddingRight": n.get("paddingRight"),
        "paddingTop": n.get("paddingTop"),
        "paddingBottom": n.get("paddingBottom"),
        "primaryAxisAlignItems": n.get("primaryAxisAlignItems"),
        "counterAxisAlignItems": n.get("counterAxisAlignItems"),
        "layoutSizingHorizontal": n.get("layoutSizingHorizontal"),
        "layoutSizingVertical": n.get("layoutSizingVertical"),
        "constraints": n.get("constraints"),
        "clipsContent": n.get("clipsContent"),
        "strokeWeight": n.get("strokeWeight"),
        "strokeAlign": n.get("strokeAlign"),
        "individualStrokeWeights": n.get("individualStrokeWeights"),
        "fills": [norm_paint(p) for p in n.get("fills") or ()],
        "strokes": [norm_paint(p) for p in n.get("strokes") or ()],
        "effects": [norm_effect(e) for e in n.get("effects") or ()],
        "styles": n.get("styles"),
        "boundVariables": n.get("boundVariables"),
    }
    if n.get("type") == "TEXT":
        spec["characters"] = n.get("characters")
        spec["style"] = norm_style_text(n.get("style"))
        if n.get("styleOverrideTable"):
            spec["styleOverrideTable"] = n["styleOverrideTable"]
        if n.get("characterStyleOverrides"):
            spec["characterStyleOverrides"] = n["characterStyleOverrides"]
    # drop nulls so the files stay readable, but only nulls -- no data loss
    return {k: v for k, v in spec.items() if v not in (None, [], {})}


def walk(n: dict, depth: int = 0):
    yield n, depth
    for c in n.get("children") or ():
        yield from walk(c, depth + 1)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--kit", required=True)
    args = ap.parse_args()

    raw = DATA / "reference" / "_raw" / f"{args.kit}-file.json"
    if not raw.exists():
        raise SystemExit(f"missing {raw.relative_to(ROOT)} -- run pull.py --inspect first")
    doc = json.loads(raw.read_text())
    root = doc.get("document") or {}
    out = DATA / "reference" / args.kit
    (out / "tokens").mkdir(parents=True, exist_ok=True)

    color_use: Counter = Counter()
    color_examples: defaultdict[str, list] = defaultdict(list)
    gradient_use: Counter = Counter()
    type_use: Counter = Counter()
    type_meta: dict[str, dict] = {}
    effect_use: Counter = Counter()
    radii: Counter = Counter()
    sizes: Counter = Counter()
    spacings: Counter = Counter()

    manifest: list[dict] = []
    seen: Counter = Counter()
    pages_summary: list[dict] = []

    for page in root.get("children") or ():
        page_name = (page.get("name") or "").strip()
        bucket = bucket_for(page_name)
        page_components = 0
        # Meta pages (Cover / Examples / License / separators) are skipped entirely so
        # their promotional artwork does not pollute the token harvest.
        if bucket == "00-meta":
            pages_summary.append({"page": page_name, "bucket": bucket, "components": 0})
            continue

        # palette / type / effect harvest across the WHOLE page (incl. instances)
        for node, _ in walk(page):
            for p in (node.get("fills") or []) + (node.get("strokes") or []):
                if p.get("visible") is False:
                    continue
                if p.get("type") == "SOLID":
                    key = f"{hexof(p.get('color') or {})}@{round((p.get('color') or {}).get('a', 1) * p.get('opacity', 1), 3)}"
                    color_use[key] += 1
                    if len(color_examples[key]) < 8:
                        color_examples[key].append(f"{page_name} / {node.get('name')}")
                elif (p.get("type") or "").startswith("GRADIENT"):
                    gradient_use[json.dumps(norm_paint(p).get("gradientStops"), sort_keys=True)] += 1
            for e in node.get("effects") or ():
                if e.get("visible") is False:
                    continue
                ek = json.dumps(norm_effect(e), sort_keys=True)
                effect_use[ek] += 1
            if node.get("type") == "TEXT" and node.get("style"):
                st = norm_style_text(node["style"]) or {}
                k = type_key(st)
                type_use[k] += 1
                type_meta.setdefault(k, st)
            r = node.get("cornerRadius")
            if r:
                radii[str(r)] += 1
            for rr in node.get("rectangleCornerRadii") or ():
                if rr:
                    radii[str(rr)] += 1
            if node.get("itemSpacing"):
                spacings[str(node["itemSpacing"])] += 1
            b = node.get("absoluteBoundingBox") or {}
            if b.get("width") and b.get("height") and node.get("type") in ("COMPONENT", "COMPONENT_SET"):
                sizes[f"{round(b['width'])}x{round(b['height'])}"] += 1

        for node, _ in walk(page):
            if node.get("type") not in ("COMPONENT", "COMPONENT_SET"):
                continue
            name = (node.get("name") or "untitled").strip()
            spec = {
                "kit": args.kit,
                "page": page_name,
                "bucket": bucket,
                "component": name,
                "nodeId": node.get("id"),
                "kind": node.get("type"),
                "description": node.get("description"),
                "properties": node.get("componentPropertyDefinitions"),
                "layout": node_spec(node),
                "variants": [
                    {"name": c.get("name"), "nodeId": c.get("id"),
                     **{k: c.get(k) for k in ("cornerRadius", "itemSpacing") if c.get(k) is not None},
                     "fills": [norm_paint(p) for p in c.get("fills") or ()],
                     "effects": [norm_effect(e) for e in c.get("effects") or ()],
                     "bbox": (lambda b: {"width": b.get("width"), "height": b.get("height")})(c.get("absoluteBoundingBox") or {})}
                    for c in (node.get("children") or ())
                    if c.get("type") in ("COMPONENT", "FRAME", "INSTANCE")
                ][:40],
                "textStyles": [],
                "descendants": [],
            }
            # every text style + paint used inside this component
            for child, d in walk(node):
                if child is node:
                    continue
                if child.get("type") == "TEXT" and child.get("style"):
                    st = norm_style_text(child["style"]) or {}
                    spec["textStyles"].append({"characters": child.get("characters"), "style": st,
                                               "nodeId": child.get("id"), "depth": d})
                if d <= 2:
                    spec["descendants"].append(node_spec(child))
            spec["textStyles"] = spec["textStyles"][:120]
            spec["descendants"] = spec["descendants"][:60]

            base = f"{slug(page_name)}__{slug(name)}"
            seen[base] += 1
            fname = f"{base}.json" if seen[base] == 1 else f"{base}-{seen[base]}.json"
            folder = out / "specs" / bucket
            folder.mkdir(parents=True, exist_ok=True)
            (folder / fname).write_text(json.dumps(spec, ensure_ascii=False, indent=2))
            manifest.append({"page": page_name, "bucket": bucket, "name": name,
                             "nodeId": node.get("id"), "kind": node.get("type"),
                             "variants": len(spec["variants"]),
                             "file": f"specs/{bucket}/{fname}"})
            page_components += 1

        pages_summary.append({"page": page_name, "bucket": bucket, "components": page_components})

    (out / "tokens" / "colors.json").write_text(json.dumps({
        "note": "Every solid paint found in the file, aggregated. hex + effective alpha "
                "(color.a * paint.opacity). examples = where it is used.",
        "colors": [
            {"hex": k.split("@")[0], "alpha": float(k.split("@")[1]), "uses": n,
             "examples": color_examples[k]}
            for k, n in color_use.most_common()
        ],
        "gradients": [{"definition": json.loads(k), "uses": n} for k, n in gradient_use.most_common()],
    }, ensure_ascii=False, indent=2))

    (out / "tokens" / "typography.json").write_text(json.dumps({
        "note": "Every distinct text style in the file, aggregated by font/size/leading/tracking.",
        "styles": [{"key": k, "uses": type_use[k], **type_meta[k]} for k in
                   sorted(type_use, key=lambda x: -type_use[x])],
    }, ensure_ascii=False, indent=2))

    (out / "tokens" / "effects.json").write_text(json.dumps({
        "note": "Every distinct effect: BACKGROUND_BLUR is the Liquid Glass material layer.",
        "effects": [{"definition": json.loads(k), "uses": n} for k, n in effect_use.most_common()],
    }, ensure_ascii=False, indent=2))

    (out / "tokens" / "geometry.json").write_text(json.dumps({
        "note": "Corner radii, auto-layout spacing and component sizes with usage counts.",
        "cornerRadii": dict(radii.most_common()),
        "itemSpacing": dict(spacings.most_common()),
        "componentSizes": dict(sizes.most_common(200)),
    }, ensure_ascii=False, indent=2))

    (out / "MANIFEST.json").write_text(json.dumps({
        "kit": args.kit,
        "source": f"reference/_raw/{args.kit}-file.json",
        "componentCount": len(manifest),
        "pages": pages_summary,
        "components": manifest,
    }, ensure_ascii=False, indent=2))

    lines = [f"# {args.kit} 组件索引", "",
             f"组件 {len(manifest)} 个 · 颜色 {len(color_use)} 种 · 文字样式 {len(type_use)} 种 · 效果 {len(effect_use)} 种",
             "", "| 页面 | 分类 | 组件数 |", "|---|---|---|"]
    for p in pages_summary:
        if p["components"]:
            lines.append(f'| {p["page"]} | {p["bucket"]} | {p["components"]} |')
    (out / "index.md").write_text("\n".join(lines))

    print(f"{args.kit}: {len(manifest)} components")
    print(f"  colors {len(color_use)} / gradients {len(gradient_use)} / "
          f"type {len(type_use)} / effects {len(effect_use)}")
    print(f"  -> {(out / 'specs').relative_to(ROOT)}/  {(out / 'tokens').relative_to(ROOT)}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
