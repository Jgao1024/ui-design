#!/usr/bin/env python3
"""把 reference/macos27 汇总成 App 运行时读取的精简 JSON（public/data/）并复制命中的 SVG（public/svg/）。
用法：python3 apps/macos/scripts/build-data.py   （或 pnpm data:macos）"""
import json
import re
import shutil
import sys
from pathlib import Path

sys.dont_write_bytecode = True
APP = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parents[3] / "figma" / "tools"))
from refdata import ROOT, REF, CATEGORY_LABEL, HIG, HIG_URL, TOKEN_PAGES, walk  # noqa: E402

KIT = "macos27"
KIT_DIR = REF / KIT
DATA = APP / "public" / "data"
SVG = APP / "public" / "svg"
MAX_TEXTS = 12
PRIVATE_USE = re.compile("[\ue000-\uf8ff\U000f0000-\U0010ffff]+")


def rnd(x):
    if isinstance(x, (int, float)):
        x = round(x, 2)
        return int(x) if x == int(x) else x
    return x


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def safe_id(node_id):
    return re.sub(r"[^0-9A-Za-z_-]", "-", node_id)


# ---------- 规格瘦身 ----------

def slim_fills(fills):
    out = []
    for f in fills or []:
        if f.get("visible") is False:
            continue
        if f.get("type") == "SOLID":
            out.append({"t": "SOLID", "hex": f.get("hex"), "a": rnd(f.get("alpha", 1))})
        else:
            out.append({"t": f.get("type")})
    return out


def slim_effects(effects):
    out = []
    for e in effects or []:
        if e.get("visible") is False:
            continue
        item = {"t": e.get("type")}
        if "radius" in e:
            item["r"] = rnd(e["radius"])
        out.append(item)
    return out


def slim_texts(text_styles):
    seen, out = {}, []
    for t in text_styles or []:
        st = t.get("style") or {}
        chars = PRIVATE_USE.sub("[SF Symbol]", t.get("characters") or "")
        chars = chars.replace("\n", " ")[:60]
        key = (st.get("fontFamily"), st.get("fontWeight"), st.get("fontSize"),
               st.get("lineHeightPx"), st.get("letterSpacing"), chars)
        if key in seen:
            seen[key]["n"] += 1
            continue
        if len(out) >= MAX_TEXTS:
            continue
        item = {"f": st.get("fontFamily"), "w": rnd(st.get("fontWeight")), "s": rnd(st.get("fontSize")),
                "lh": rnd(st.get("lineHeightPx")), "ls": rnd(st.get("letterSpacing")), "t": chars, "n": 1}
        seen[key] = item
        out.append(item)
    return out


def slim_node(n, texts, src):
    bb = n.get("bbox") or {}
    s = {"w": rnd(bb.get("width")), "h": rnd(bb.get("height")),
         "fills": slim_fills(n.get("fills")), "effects": slim_effects(n.get("effects")),
         "texts": texts, "src": src}
    if n.get("cornerRadius") is not None:
        s["r"] = rnd(n["cornerRadius"])
    elif n.get("rectangleCornerRadii"):
        s["r"] = [rnd(x) for x in n["rectangleCornerRadii"]]
    if n.get("layoutMode") in ("HORIZONTAL", "VERTICAL"):
        s["dir"] = n["layoutMode"][0]
        if n.get("itemSpacing") is not None:
            s["gap"] = rnd(n["itemSpacing"])
    return s


class Specs:
    """specs/*/*.json 按文件内的 nodeId 建索引，不使用文件名。"""

    def __init__(self):
        self.path = {}
        self.cache = {}
        for f in sorted((KIT_DIR / "specs").glob("*/*.json")):
            try:
                nid = json.loads(f.read_text(encoding="utf-8")).get("nodeId")
            except (OSError, ValueError):
                continue
            if nid:
                self.path[nid] = f
        self.hit = self.miss = 0

    def load(self, nid):
        if nid not in self.path:
            return None
        if nid not in self.cache:
            self.cache[nid] = json.loads(self.path[nid].read_text(encoding="utf-8"))
        return self.cache[nid]

    def own(self, nid):
        d = self.load(nid)
        if not d or not d.get("layout"):
            return None
        return slim_node(d["layout"], slim_texts(d.get("textStyles")), "own")

    def from_set(self, set_id, nid):
        """变体自己没有规格文件时，取族文件 variants[] 里同 nodeId 的条目。"""
        d = self.load(set_id)
        if not d:
            return None
        for v in d.get("variants") or []:
            if v.get("nodeId") == nid:
                node = dict(v)
                for x in d.get("descendants") or []:
                    if x.get("id") == nid:
                        node["layoutMode"] = x.get("layoutMode")
                        node["itemSpacing"] = x.get("itemSpacing")
                        break
                return slim_node(node, [], "set")
        return None

    def forget(self, nid):
        self.cache.pop(nid, None)


# ---------- SVG ----------

def load_svg_map():
    mf = KIT_DIR / "svg" / "MANIFEST.json"
    if not mf.is_file():
        return {}
    try:
        items = json.loads(mf.read_text(encoding="utf-8")).get("items") or []
    except (OSError, ValueError):
        return {}
    return {it["id"]: it["file"] for it in items if it.get("id") and it.get("file")}


class SvgCopier:
    def __init__(self):
        self.map = load_svg_map()
        self.copied = 0
        shutil.rmtree(SVG, ignore_errors=True)

    def get(self, nid):
        rel = self.map.get(nid)
        if not rel:
            return None
        src = KIT_DIR / rel
        if not src.is_file():
            return None
        SVG.mkdir(parents=True, exist_ok=True)
        name = safe_id(nid) + ".svg"
        shutil.copyfile(src, SVG / name)
        self.copied += 1
        return "svg/" + name


# ---------- 页面数据 ----------

def parse_axes_value(name):
    v = {}
    for part in re.split(r",\s*", name):
        if "=" in part:
            k, val = part.split("=", 1)
            v[k.strip()] = val.strip()
    return v


def build_set(s, specs, svg):
    kids = []
    for k in s["kids"]:
        spec = specs.own(k["id"]) or specs.from_set(s["id"], k["id"])
        specs.forget(k["id"])
        item = {"id": k["id"], "name": k["name"], "v": parse_axes_value(k["name"]),
                "w": rnd(k["w"]), "h": rnd(k["h"])}
        if spec:
            item["spec"] = spec
        sv = svg.get(k["id"])
        if sv:
            item["svg"] = sv
        kids.append(item)
    specs.forget(s["id"])
    out = {"id": s["id"], "name": s["name"],
           "axes": [{"name": k, "values": v} for k, v in s["axes"].items()], "variants": kids}
    sv = svg.get(s["id"])
    if sv:
        out["svg"] = sv
    return out


def build_solo(s, specs, svg):
    out = {"id": s["id"], "name": s["name"], "w": rnd(s["w"]), "h": rnd(s["h"])}
    spec = specs.own(s["id"])
    specs.forget(s["id"])
    if spec:
        out["spec"] = spec
    sv = svg.get(s["id"])
    if sv:
        out["svg"] = sv
    return out


def hex_alpha(e):
    return f"{e.get('hex', '')}@{rnd(e.get('alpha', 1))}"


def effect_summary(d):
    t = d.get("type")
    parts = []
    if "offset" in d:
        parts.append(f"offset {rnd(d['offset'].get('x', 0))},{rnd(d['offset'].get('y', 0))}")
    if "radius" in d:
        parts.append(f"radius {rnd(d['radius'])}")
    if "spread" in d:
        parts.append(f"spread {rnd(d['spread'])}")
    if "hex" in d:
        parts.append(hex_alpha(d))
    return ", ".join(parts) or ("Liquid Glass" if t == "GLASS" else "—")


def build_token_page(fn, keys):
    d = json.loads((KIT_DIR / "tokens" / fn).read_text(encoding="utf-8"))
    if fn == "colors.json":
        return {"colors": [{"hex": c["hex"], "a": rnd(c["alpha"]), "uses": c["uses"],
                            "ex": list(dict.fromkeys(c.get("examples") or []))[:3]} for c in d["colors"]],
                "gradients": [{"stops": [{"hex": s["hex"], "a": rnd(s["alpha"]), "pos": rnd(s["position"])}
                                         for s in g["definition"]], "uses": g["uses"]} for g in d["gradients"]]}
    if fn == "typography.json":
        return {"styles": [{"f": s["fontFamily"], "ps": s.get("fontPostScriptName"), "w": rnd(s["fontWeight"]),
                            "s": rnd(s["fontSize"]), "lh": rnd(s["lineHeightPx"]), "ls": rnd(s["letterSpacing"]),
                            "uses": s["uses"]} for s in d["styles"]]}
    if fn == "effects.json":
        return {"effects": [{"t": e["definition"]["type"], "sum": effect_summary(e["definition"]),
                             "uses": e["uses"]} for e in d["effects"]]}
    return {k: [{"k": key, "uses": uses} for key, uses in d[k].items()] for k in keys}


def main():
    raw = json.loads((REF / "_raw" / f"{KIT}-file.json").read_text(encoding="utf-8"))
    doc = raw.get("document", raw)
    inv = {"sets": [], "solo": []}
    for pg in doc["children"]:
        walk(pg, pg["name"], False, inv)

    manifest = json.loads((KIT_DIR / "MANIFEST.json").read_text(encoding="utf-8"))
    pages = [p for p in manifest["pages"] if p["bucket"] != "00-meta"]
    by_bucket = {}
    for p in pages:
        by_bucket.setdefault(p["bucket"], []).append(p["page"])

    specs, svg = Specs(), SvgCopier()
    shutil.rmtree(DATA, ignore_errors=True)
    (DATA / "pages").mkdir(parents=True)

    is_int = lambda n: n.startswith("_")
    hig = HIG[KIT]
    categories, metas = [], []
    n_pub = n_solo = n_var = 0

    for bucket in sorted(by_bucket):
        slugs = []
        entries = []
        for page in by_bucket[bucket]:
            sets = [s for s in inv["sets"] if s["page"] == page]
            solo = [s for s in inv["solo"] if s["page"] == page]
            if page == "Text Styles" and not sets and not solo:
                continue
            entries.append((page, sets, solo))
        for page, sets, solo in entries:
            slug = slugify(page)
            pub = [s for s in sets if not is_int(s["name"])]
            int_sets = [s for s in sets if is_int(s["name"])]
            solo_pub = [s for s in solo if not is_int(s["name"])]
            int_solo = [s for s in solo if is_int(s["name"])]
            n_pub += len(pub)
            n_solo += len(solo_pub)
            n_var += sum(s["variants"] for s in pub)
            meta = {"slug": slug, "name": page, "bucket": bucket, "label": CATEGORY_LABEL[bucket],
                    "hig": [{"slug": h, "url": HIG_URL + h} for h in hig.get(page, [])],
                    "pub": len(pub), "solo": len(solo_pub),
                    "variants": sum(s["variants"] for s in pub), "internal": len(int_sets) + len(int_solo),
                    "families": [{"id": s["id"], "name": s["name"]} for s in pub]}
            data = {**meta, "kind": "kit",
                    "sets": [build_set(s, specs, svg) for s in pub],
                    "solo": [build_solo(s, specs, svg) for s in solo_pub],
                    "internalSets": [build_set(s, specs, svg) for s in int_sets],
                    "internalSolo": [build_solo(s, specs, svg) for s in int_solo]}
            write_page(slug, data)
            metas.append(meta)
            slugs.append(slug)
        if bucket == "08-tokens":
            for fn, keys, name, _desc in TOKEN_PAGES:
                slug = "tokens-" + fn.removesuffix(".json")
                meta = {"slug": slug, "name": name, "bucket": bucket, "label": CATEGORY_LABEL[bucket],
                        "hig": [], "pub": 0, "solo": 0, "variants": 0, "internal": 0, "families": []}
                write_page(slug, {**meta, "kind": "tokens", "file": fn.removesuffix(".json"),
                                  "desc": _desc, "tokens": build_token_page(fn, keys)})
                metas.append(meta)
                slugs.append(slug)
        categories.append({"id": bucket, "label": CATEGORY_LABEL[bucket], "pages": slugs})

    assert len({m["slug"] for m in metas}) == len(metas), "页面 slug 重复"
    (DATA / "index.json").write_text(
        json.dumps({"categories": categories, "pages": metas}, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8")

    print(f"规格索引 {len(specs.path)} 个文件；SVG 命中 {svg.copied} 个")
    print(f"页面 {len(metas)} · 公开族 {n_pub} · 独立组件 {n_solo} · 变体 {n_var}")


def write_page(slug, data):
    (DATA / "pages" / f"{slug}.json").write_text(
        json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


if __name__ == "__main__":
    main()
