#!/usr/bin/env python3
"""把 reference/macos27 汇总成原生 App 读取的 registry.json。
用法：python3 native/macos/scripts/build-data.py
输出：native/macos/ComponentGalleryMac/Resources/registry.json（已被 .gitignore 忽略）"""
import json
import re
import sys
from pathlib import Path

sys.dont_write_bytecode = True
APP = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "tools"))
from refdata import REF, CATEGORY_LABEL, HIG, HIG_URL, TOKEN_PAGES, walk  # noqa: E402
from swiftui_map import MAP  # noqa: E402

KIT = "macos27"
KIT_DIR = REF / KIT
OUT = APP / "ComponentGalleryMac" / "Resources" / "registry.json"
EXPECT = {"pages": 36, "families": 71, "solos": 17, "variants": 869}


def rnd(x):
    if isinstance(x, (int, float)):
        x = round(x, 2)
        return int(x) if x == int(x) else x
    return 0


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def axis_values(name):
    out = {}
    for part in re.split(r",\s*", name):
        if "=" in part:
            k, v = part.split("=", 1)
            out[k.strip()] = v.strip()
    return out


def family(s):
    return {"id": s["id"], "name": s["name"],
            "axes": [{"name": k, "values": v} for k, v in s["axes"].items()],
            "variants": [{"id": k["id"], "values": axis_values(k["name"]),
                          "w": rnd(k["w"]), "h": rnd(k["h"])} for k in s["kids"]]}


def solo(s):
    return {"id": s["id"], "name": s["name"], "axes": [], "variants": [], "w": rnd(s["w"]), "h": rnd(s["h"])}


def swiftui(key):
    level, api = MAP[KIT][key]
    return {"level": level, "api": api}


def token_data(fn):
    d = json.loads((KIT_DIR / "tokens" / fn).read_text(encoding="utf-8"))
    if fn == "colors.json":
        return {"colors": [{"hex": c["hex"], "alpha": rnd(c["alpha"]), "uses": c["uses"]} for c in d["colors"]],
                "gradients": [{"stops": [{"hex": s["hex"], "alpha": rnd(s["alpha"]), "position": rnd(s["position"])}
                                         for s in g["definition"]], "uses": g["uses"]} for g in d["gradients"]]}
    if fn == "typography.json":
        return {"styles": [{"family": s["fontFamily"], "weight": rnd(s["fontWeight"]), "size": rnd(s["fontSize"]),
                            "lineHeight": rnd(s["lineHeightPx"]), "letterSpacing": rnd(s["letterSpacing"]),
                            "uses": s["uses"]} for s in d["styles"]]}
    if fn == "effects.json":
        out = []
        for e in d["effects"]:
            x = e["definition"]
            out.append({"type": x.get("type", ""), "radius": rnd(x.get("radius")),
                        "offsetX": rnd((x.get("offset") or {}).get("x")), "offsetY": rnd((x.get("offset") or {}).get("y")),
                        "spread": rnd(x.get("spread")), "hex": x.get("hex"), "alpha": rnd(x.get("alpha", 1)),
                        "uses": e["uses"]})
        return {"effects": out}
    return {k: [{"key": key, "uses": uses} for key, uses in d[k].items()]
            for k in ("cornerRadii", "itemSpacing", "componentSizes")}


def main():
    raw = json.loads((REF / "_raw" / f"{KIT}-file.json").read_text(encoding="utf-8"))
    doc = raw.get("document", raw)
    inv = {"sets": [], "solo": []}
    for pg in doc["children"]:
        walk(pg, pg["name"], False, inv)

    manifest = json.loads((KIT_DIR / "MANIFEST.json").read_text(encoding="utf-8"))
    by_bucket = {}
    for p in manifest["pages"]:
        if p["bucket"] in CATEGORY_LABEL:
            by_bucket.setdefault(p["bucket"], []).append(p["page"])

    is_internal = lambda n: n.startswith("_")
    categories = []
    n = {"pages": 0, "families": 0, "solos": 0, "variants": 0, "internals": 0}

    for bucket in sorted(by_bucket):
        pages = []
        for name in by_bucket[bucket]:
            sets = [s for s in inv["sets"] if s["page"] == name]
            solos = [s for s in inv["solo"] if s["page"] == name]
            if not sets and not solos:
                continue  # Text Styles 页在 kit 里是空的，由令牌页「文字样式」替代
            pub = [s for s in sets if not is_internal(s["name"])]
            internals = ([{"id": s["id"], "name": s["name"], "variants": s["variants"]} for s in sets if is_internal(s["name"])]
                         + [{"id": s["id"], "name": s["name"], "variants": 0} for s in solos if is_internal(s["name"])])
            page = {"slug": slugify(name), "name": name, "kind": "kit",
                    "category": bucket, "categoryLabel": CATEGORY_LABEL[bucket],
                    "hig": [{"slug": h, "url": HIG_URL + h} for h in HIG[KIT].get(name, [])],
                    "swiftui": swiftui(name),
                    "families": [family(s) for s in pub],
                    "solos": [solo(s) for s in solos if not is_internal(s["name"])],
                    "internals": internals}
            n["families"] += len(pub)
            n["solos"] += len(page["solos"])
            n["variants"] += sum(s["variants"] for s in pub)
            n["internals"] += len(internals)
            pages.append(page)
        if bucket == "08-tokens":
            for fn, _keys, name, desc in TOKEN_PAGES:
                key = "tokens-" + fn.removesuffix(".json")
                pages.append({"slug": key, "name": name, "kind": key, "summary": desc, "hig": [],
                              "category": bucket, "categoryLabel": CATEGORY_LABEL[bucket],
                              "swiftui": swiftui(key), "families": [], "solos": [], "internals": [],
                              "tokens": token_data(fn)})
        n["pages"] += len(pages)
        categories.append({"id": bucket, "label": CATEGORY_LABEL[bucket], "pages": pages})

    slugs = [p["slug"] for c in categories for p in c["pages"]]
    assert len(set(slugs)) == len(slugs), "页面 slug 重复"
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({"kit": KIT, "categories": categories}, ensure_ascii=False, separators=(",", ":")),
                   encoding="utf-8")

    print(f"页面 {n['pages']} · 公开族 {n['families']} · 独立组件 {n['solos']} · 变体 {n['variants']} · 内部件 {n['internals']}")
    bad = {k: (n[k], v) for k, v in EXPECT.items() if n[k] != v}
    if bad:
        sys.exit(f"对账失败（实际, 期望）：{bad}")
    print(f"对账通过 → {OUT.relative_to(APP)}（{OUT.stat().st_size // 1024} KB）")


if __name__ == "__main__":
    main()
