#!/usr/bin/env python3
"""iOS 27 App 数据脚本：reference/ → apps/ios/public/{data,svg}。
用法：pnpm data:ios

输出：
  public/data/index.json            页面清单、搜索索引
  public/data/pages/<slug>.json     页面结构（族 → 变体、独立组件、内部件）
  public/data/specs/<slug>.json     页面内各节点的瘦身规格（按 nodeId 索引，面板打开时才加载）
  public/data/tokens/<name>.json    令牌页数据
  public/svg/<nodeId>.svg           命中的 SVG（目录或文件不存在时静默跳过）
"""
import collections
import json
import re
import shutil
import sys
from pathlib import Path

APP = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(APP.parent.parent / "tools"))
from refdata import ROOT, REF, CATEGORY_LABEL, HIG, HIG_URL, TOKEN_PAGES, walk  # noqa: E402

KIT = "ios27"
KIT_DIR = REF / KIT
PUB = APP / "public"
DATA = PUB / "data"
SVG_OUT = PUB / "svg"

EXPECT = {"页面": 40, "公开族": 81, "独立组件": 67, "变体": 520}


# ───────────────────────── 工具 ─────────────────────────

def r2(x):
    return round(x, 2) if isinstance(x, (int, float)) else x


def dump(path, obj):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, separators=(",", ":"))


def slugify(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def parse_axes(name):
    kv = {}
    for part in re.split(r",\s*", name):
        if "=" in part:
            k, v = part.split("=", 1)
            kv[k.strip()] = v.strip()
    return kv


# ───────────────────────── 规格瘦身 ─────────────────────────

def slim_fills(lst):
    out = []
    for f in lst or []:
        if f.get("visible") is False:
            continue
        if f.get("type") == "SOLID" and f.get("hex"):
            out.append([f["hex"], r2(f.get("alpha", 1))])
        else:
            out.append([f.get("type") or "?", None])
    return out


def slim_effects(lst):
    out = []
    for e in lst or []:
        if e.get("visible") is False:
            continue
        o = {"t": e.get("type")}
        if e.get("radius") is not None:
            o["r"] = r2(e["radius"])
        if e.get("hex"):
            o["hex"] = e["hex"]
            o["a"] = r2(e.get("alpha", 1))
        off = e.get("offset")
        if off:
            o["x"] = r2(off.get("x", 0))
            o["y"] = r2(off.get("y", 0))
        if e.get("spread"):
            o["s"] = r2(e["spread"])
        out.append(o)
    return out


def slim_node(n):
    o = {}
    bb = n.get("bbox") or {}
    if bb.get("width") is not None:
        o["w"] = r2(bb["width"])
        o["h"] = r2(bb["height"])
    if n.get("cornerRadius"):
        o["r"] = r2(n["cornerRadius"])
    rc = n.get("rectangleCornerRadii")
    if rc and len(set(rc)) > 1:
        o["rc"] = [r2(x) for x in rc]
    lm = n.get("layoutMode")
    if lm in ("HORIZONTAL", "VERTICAL"):
        o["dir"] = lm[0]
        if n.get("itemSpacing"):
            o["gap"] = r2(n["itemSpacing"])
    pad = [n.get(k) or 0 for k in ("paddingTop", "paddingRight", "paddingBottom", "paddingLeft")]
    if any(pad):
        o["pad"] = [r2(p) for p in pad]
    fills = slim_fills(n.get("fills"))
    if fills:
        o["fill"] = fills
    strokes = slim_fills(n.get("strokes"))
    if strokes:
        o["stroke"] = strokes
        o["sw"] = r2(n.get("strokeWeight") or 0)
    fx = slim_effects(n.get("effects"))
    if fx:
        o["fx"] = fx
    if n.get("opacity") not in (None, 1, 1.0):
        o["op"] = r2(n["opacity"])
    return o


def slim_spec(d):
    root = slim_node(d.get("layout") or {})
    nodes, all_nodes = [], [d.get("layout") or {}] + list(d.get("descendants") or [])
    for n in d.get("descendants") or []:
        if n.get("type") == "TEXT" or n.get("visible") is False:
            continue
        s = slim_node(n)
        s["n"] = n.get("name", "")
        s["t"] = n.get("type", "")
        nodes.append(s)
    colors = collections.Counter()
    effects = {}
    for n in all_nodes:
        for key in ("fills", "strokes"):
            for hexa in slim_fills(n.get(key)):
                if hexa[1] is not None:
                    colors[(hexa[0], hexa[1])] += 1
        for e in slim_effects(n.get("effects")):
            effects.setdefault(json.dumps(e, sort_keys=True), e)
    text, seen = [], set()
    for t in d.get("textStyles") or []:
        st = t.get("style") or {}
        item = {"c": (t.get("characters") or "")[:60], "f": st.get("fontFamily"), "w": st.get("fontWeight"),
                "s": r2(st.get("fontSize")), "lh": r2(st.get("lineHeightPx")), "ls": r2(st.get("letterSpacing"))}
        key = json.dumps(item, sort_keys=True)
        if key not in seen:
            seen.add(key)
            text.append(item)
    out = {"name": d.get("component", ""), "kind": d.get("kind", ""), "root": root}
    if text:
        out["text"] = text[:12]
    if colors:
        out["colors"] = [[h, a, c] for (h, a), c in colors.most_common(16)]
    if effects:
        out["fx"] = list(effects.values())[:12]
    if nodes:
        out["nodes"] = nodes[:40]
        if len(nodes) > 40:
            out["more"] = len(nodes) - 40
    return out


def load_specs():
    """按文件内的 nodeId 建索引（不看文件名）。"""
    idx = {}
    for f in sorted((KIT_DIR / "specs").glob("*/*.json")):
        try:
            d = json.load(open(f, encoding="utf-8"))
        except (OSError, ValueError):
            continue
        nid = d.get("nodeId")
        if nid:
            idx[nid] = slim_spec(d)
    return idx


# ───────────────────────── SVG ─────────────────────────

def load_svg_map():
    mf = KIT_DIR / "svg" / "MANIFEST.json"
    if not mf.is_file():
        return {}
    try:
        items = json.load(open(mf, encoding="utf-8")).get("items", [])
    except (OSError, ValueError):
        return {}
    out = {}
    for it in items:
        src = KIT_DIR / (it.get("file") or "")
        if it.get("id") and it.get("file") and src.is_file():
            out[it["id"]] = src
    return out


SVG_MAP = {}
SVG_COPIED = {}


def svg_of(node_id):
    """命中则复制到 public/svg 并返回相对路径，否则返回 None。"""
    if node_id in SVG_COPIED:
        return SVG_COPIED[node_id]
    src = SVG_MAP.get(node_id)
    if not src:
        return None
    name = re.sub(r"[^0-9A-Za-z_-]", "-", node_id) + ".svg"
    SVG_OUT.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, SVG_OUT / name)
    SVG_COPIED[node_id] = "svg/" + name
    return SVG_COPIED[node_id]


# ───────────────────────── 页面打包 ─────────────────────────

def pack_set(s):
    axes = list(s["axes"].items())
    kids = []
    for k in s["kids"]:
        kv = parse_axes(k["name"])
        o = {"id": k["id"], "name": k["name"], "w": r2(k["w"]), "h": r2(k["h"]),
             "v": [kv.get(a, "") for a, _ in axes]}
        sv = svg_of(k["id"])
        if sv:
            o["svg"] = sv
        kids.append(o)
    return {"kind": "set", "id": s["id"], "name": s["name"], "variants": s["variants"],
            "axes": [[a, vals] for a, vals in axes], "kids": kids}


def pack_solo(s):
    o = {"kind": "solo", "id": s["id"], "name": s["name"], "w": r2(s["w"]), "h": r2(s["h"])}
    sv = svg_of(s["id"])
    if sv:
        o["svg"] = sv
    return o


def spec_ids(items):
    ids = []
    for it in items:
        ids.append(it["id"])
        ids.extend(k["id"] for k in it.get("kids", []))
    return ids


def clean(path):
    if path.exists():
        shutil.rmtree(path)


def main():
    global SVG_MAP
    raw = json.load(open(REF / "_raw" / f"{KIT}-file.json", encoding="utf-8"))
    doc = raw.get("document", raw)
    inv = {"sets": [], "solo": []}
    for pg in doc["children"]:
        walk(pg, pg["name"], False, inv)

    manifest = json.load(open(KIT_DIR / "MANIFEST.json", encoding="utf-8"))
    pages = [p for p in manifest["pages"] if p["bucket"] != "00-meta"]
    by_bucket = collections.defaultdict(list)
    for p in pages:
        by_bucket[p["bucket"]].append(p["page"])

    clean(DATA)
    clean(SVG_OUT)
    SVG_MAP = load_svg_map()
    specs = load_specs()

    is_int = lambda n: n.startswith("_")
    index_pages = []
    n_pub = n_solo = n_var = 0
    used_slugs = set()

    for bucket in sorted(by_bucket):
        for page in by_bucket[bucket]:
            sets = [s for s in inv["sets"] if s["page"] == page]
            solo = [s for s in inv["solo"] if s["page"] == page]
            pub = [s for s in sets if not is_int(s["name"])]
            internal = [s for s in sets if is_int(s["name"])]
            internal_solo = [s for s in solo if is_int(s["name"])]
            solo_pub = [s for s in solo if not is_int(s["name"])]

            slug = slugify(page) or "page"
            while slug in used_slugs:
                slug += "-2"
            used_slugs.add(slug)

            n_pub += len(pub)
            n_solo += len(solo_pub)
            nv = sum(s["variants"] for s in pub)
            n_var += nv

            page_obj = {
                "slug": slug, "name": page, "cat": bucket,
                "sets": [pack_set(s) for s in pub],
                "solo": [pack_solo(s) for s in solo_pub],
                "internal": [pack_set(s) for s in internal] + [pack_solo(s) for s in internal_solo],
            }
            dump(DATA / "pages" / f"{slug}.json", page_obj)
            ids = spec_ids(page_obj["sets"]) + spec_ids(page_obj["solo"]) + spec_ids(page_obj["internal"])
            dump(DATA / "specs" / f"{slug}.json", {i: specs[i] for i in ids if i in specs})

            index_pages.append({
                "slug": slug, "name": page, "cat": bucket, "kind": "kit",
                "hig": HIG[KIT].get(page, []),
                "nPub": len(pub), "nSolo": len(solo_pub), "nVar": nv,
                "nInt": len(internal) + len(internal_solo),
                "fams": [{"id": s["id"], "name": s["name"]} for s in pub],
            })

    # 令牌页：追加到 08-tokens 末尾
    token_slim = {
        "colors": lambda d: {
            "colors": [{"hex": c["hex"], "a": r2(c.get("alpha", 1)), "uses": c.get("uses", 0)} for c in d["colors"]],
            "gradients": [{"stops": [{"hex": s["hex"], "a": r2(s.get("alpha", 1)), "p": r2(s.get("position", 0))}
                                     for s in g["definition"]], "uses": g.get("uses", 0)} for g in d["gradients"]],
        },
        "typography": lambda d: {"styles": [
            {"f": s.get("fontFamily"), "w": s.get("fontWeight"), "s": r2(s.get("fontSize")),
             "lh": r2(s.get("lineHeightPx")), "ls": r2(s.get("letterSpacing")), "uses": s.get("uses", 0)}
            for s in d["styles"]]},
        "effects": lambda d: {"effects": [{"def": e["definition"], "uses": e.get("uses", 0)} for e in d["effects"]]},
        "geometry": lambda d: {k: d[k] for k in ("cornerRadii", "itemSpacing", "componentSizes")},
    }
    for fn, _keys, name, desc in TOKEN_PAGES:
        key = fn.replace(".json", "")
        d = json.load(open(KIT_DIR / "tokens" / fn, encoding="utf-8"))
        dump(DATA / "tokens" / f"{key}.json", token_slim[key](d))
        index_pages.append({
            "slug": f"tokens-{key}", "name": name, "cat": "08-tokens", "kind": "tokens", "token": key,
            "desc": desc, "hig": [], "nPub": 0, "nSolo": 0, "nVar": 0, "nInt": 0, "fams": [],
        })

    # 令牌页必须排在 08-tokens 末尾（kit 页之后）：kit 页按 bucket 排序已在前，令牌页追加在后；
    # 但 08-tokens 之后没有别的分类，所以直接追加即可。
    dump(DATA / "index.json", {
        "higUrl": HIG_URL,
        "categories": [{"id": k, "label": v} for k, v in sorted(CATEGORY_LABEL.items())],
        "pages": index_pages,
        "svgCount": len(SVG_COPIED),
    })

    got = {"页面": len(index_pages), "公开族": n_pub, "独立组件": n_solo, "变体": n_var}
    for k, v in got.items():
        flag = "" if v == EXPECT[k] else f"  ← 与文档 {EXPECT[k]} 不一致"
        print(f"{k}: {v}{flag}")
    print(f"SVG: {len(SVG_COPIED)} 个已复制")


if __name__ == "__main__":
    main()
