#!/usr/bin/env python3
"""iOS 27 原生 App 数据脚本：reference/ → ComponentGalleryiOS/Resources/registry.json。
用法：python3 native/ios/scripts/build-data.py

registry.json 结构：
  categories  [{id, label}]
  pages       [{slug, name, cat, catLabel, kind, hig[], level, apis, sets[], solo[], internal[]}]
              sets:     {id, name, variants, axes[{name, values[]}], kids[{id, name, values[], w, h}]}
              solo:     {id, name, w, h}
              internal: {id, name, variants}   （variants 为 0 表示内部独立组件）
  tokens      {colors[], gradients[], styles[], effects[], cornerRadii[], itemSpacing[], componentSizes[]}
"""
import collections
import json
import re
import sys
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP.parent.parent / "tools"))
from refdata import REF, CATEGORY_LABEL, HIG, HIG_URL, TOKEN_PAGES, walk  # noqa: E402
from swiftui_map import MAP  # noqa: E402

KIT = "ios27"
KIT_DIR = REF / KIT
OUT = APP / "ComponentGalleryiOS" / "Resources" / "registry.json"
EXPECT = {"页面": 39, "公开族": 81, "独立组件": 67, "变体": 520}


def r2(x):
    return round(x, 2) if isinstance(x, (int, float)) else 0


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_axes(name):
    kv = {}
    for part in re.split(r",\s*", name):
        if "=" in part:
            k, v = part.split("=", 1)
            kv[k.strip()] = v.strip()
    return kv


def pack_set(s):
    axes = list(s["axes"].items())
    kids = []
    for k in s["kids"]:
        kv = parse_axes(k["name"])
        kids.append({"id": k["id"], "name": k["name"], "values": [kv.get(a, "") for a, _ in axes],
                     "w": r2(k["w"]), "h": r2(k["h"])})
    return {"id": s["id"], "name": s["name"], "variants": s["variants"],
            "axes": [{"name": a, "values": vals} for a, vals in axes], "kids": kids}


def pack_tokens():
    load = lambda fn: json.load(open(KIT_DIR / "tokens" / fn, encoding="utf-8"))
    colors, typo, fx, geo = load("colors.json"), load("typography.json"), load("effects.json"), load("geometry.json")
    pairs = lambda d: [{"key": k, "count": v} for k, v in d.items()]
    effects = []
    for e in fx["effects"]:
        d = e["definition"]
        off = d.get("offset") or {}
        effects.append({"type": d.get("type", ""), "hex": d.get("hex"), "alpha": r2(d.get("alpha", 1)),
                        "x": r2(off.get("x", 0)), "y": r2(off.get("y", 0)), "radius": r2(d.get("radius", 0)),
                        "spread": r2(d.get("spread", 0)), "uses": e.get("uses", 0)})
    return {
        "colors": [{"hex": c["hex"], "alpha": r2(c.get("alpha", 1)), "uses": c.get("uses", 0)} for c in colors["colors"]],
        "gradients": [{"stops": [{"hex": s["hex"], "alpha": r2(s.get("alpha", 1)), "position": r2(s.get("position", 0))}
                                 for s in g["definition"]], "uses": g.get("uses", 0)} for g in colors["gradients"]],
        "styles": [{"family": s.get("fontFamily") or "", "weight": s.get("fontWeight") or 400, "size": r2(s.get("fontSize")),
                    "lineHeight": r2(s.get("lineHeightPx")), "tracking": r2(s.get("letterSpacing")),
                    "uses": s.get("uses", 0)} for s in typo["styles"]],
        "effects": effects,
        "cornerRadii": pairs(geo["cornerRadii"]),
        "itemSpacing": pairs(geo["itemSpacing"]),
        "componentSizes": pairs(geo["componentSizes"]),
    }


def main():
    raw = json.load(open(REF / "_raw" / f"{KIT}-file.json", encoding="utf-8"))
    doc = raw.get("document", raw)
    inv = {"sets": [], "solo": []}
    for pg in doc["children"]:
        walk(pg, pg["name"], False, inv)

    manifest = json.load(open(KIT_DIR / "MANIFEST.json", encoding="utf-8"))
    by_bucket = collections.defaultdict(list)
    for p in manifest["pages"]:
        if p["bucket"] in CATEGORY_LABEL:
            by_bucket[p["bucket"]].append(p["page"])

    is_int = lambda n: n.startswith("_")
    pages, used = [], set()
    n_pub = n_solo = n_var = 0
    for bucket in sorted(by_bucket):
        for page in by_bucket[bucket]:
            sets = [s for s in inv["sets"] if s["page"] == page]
            solo = [s for s in inv["solo"] if s["page"] == page]
            if bucket == "08-tokens" and not sets and not solo:  # 空画板页，内容由令牌页承担（与 gen-docs.py 一致）
                continue
            pub = [s for s in sets if not is_int(s["name"])]
            solo_pub = [s for s in solo if not is_int(s["name"])]
            internal = ([{"id": s["id"], "name": s["name"], "variants": s["variants"]} for s in sets if is_int(s["name"])]
                        + [{"id": s["id"], "name": s["name"], "variants": 0} for s in solo if is_int(s["name"])])
            slug = slugify(page)
            while slug in used:
                slug += "-2"
            used.add(slug)
            n_pub += len(pub)
            n_solo += len(solo_pub)
            n_var += sum(s["variants"] for s in pub)
            level, apis = MAP[KIT][page]
            pages.append({"slug": slug, "name": page, "cat": bucket, "catLabel": CATEGORY_LABEL[bucket], "kind": "kit",
                          "hig": [HIG_URL + h for h in HIG[KIT].get(page, [])], "level": level, "apis": apis,
                          "sets": [pack_set(s) for s in pub],
                          "solo": [{"id": s["id"], "name": s["name"], "w": r2(s["w"]), "h": r2(s["h"])} for s in solo_pub],
                          "internal": internal})

    for fn, _keys, name, _desc in TOKEN_PAGES:
        key = "tokens-" + fn[:-5]
        level, apis = MAP[KIT][key]
        pages.append({"slug": key, "name": name, "cat": "08-tokens", "catLabel": CATEGORY_LABEL["08-tokens"],
                      "kind": "tokens", "hig": [],
                      "level": level, "apis": apis, "sets": [], "solo": [], "internal": []})

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({"categories": [{"id": k, "label": v} for k, v in sorted(CATEGORY_LABEL.items())],
                   "pages": pages, "tokens": pack_tokens()}, f, ensure_ascii=False, separators=(",", ":"))

    got = {"页面": len(pages), "公开族": n_pub, "独立组件": n_solo, "变体": n_var}
    for k, v in got.items():
        print(f"{k}: {v}" + ("" if v == EXPECT[k] else f"  ← 与文档 {EXPECT[k]} 不一致"))
    print(f"写入 {OUT.relative_to(APP.parent.parent)}（{OUT.stat().st_size // 1024} KB）")


if __name__ == "__main__":
    main()
