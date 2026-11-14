#!/usr/bin/env python3
"""Pull Figma component inventory + SVG exports for one kit into reference/.

METERED Figma REST calls (Starter plan = 6/month per file):
  1. GET /v1/files/{key}/components   (cheap; may be empty on community dups)
  1. GET /v1/files/{key}              (full tree; fallback when components is empty)
  n. GET /v1/files/{key}/images       (one call per --batch ids)
CDN downloads do NOT count against the quota. Raw responses are cached under
reference/_raw/ so re-classifying never re-fetches.

Usage:
  python3 tools/figma-pull/pull.py --kit macos27 --key XXX --inspect
  python3 tools/figma-pull/pull.py --kit macos27 --key XXX
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API = "https://api.figma.com/v1"
ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "Figma"        # Figma 抓取数据与工具
TOKEN_FILE = ROOT / ".figma.env"                      # gitignored, chmod 600
TOKEN_FILE_ALT = Path.home() / ".config" / "ui-design" / "figma.env"
CALLS = 0
EXPORTABLE = {"COMPONENT", "COMPONENT_SET", "INSTANCE", "FRAME", "GROUP", "TEXT"}


# --- buckets -----------------------------------------------------------------
BUCKETS: list[tuple[str, tuple[str, ...]]] = [
    ("08-tokens", ("color", "colour", "typograph", "text style", "type scale",
                   "spacing", "radius", "shadow", "material", "glyph", "grid",
                   "palette", "sf symbol", "symbol")),
    ("01-navigation", ("navigat", "nav bar", "sidebar", "tab", "window",
                       "titlebar", "title bar", "split", "breadcrumb")),
    ("02-bars", ("toolbar", "menu bar", "menubar", "status bar", "tab bar",
                 "ribbon", "bars")),
    ("06-overlays", ("alert", "sheet", "popover", "context menu", "dialog",
                     "modal", "hud", "tooltip", "panel", "action sheet", "drawer",
                     "menu", "views")),
    ("04-input", ("text field", "textfield", "search field", "search bar",
                  "text editor", "text view", "keyboard", "input", "combobox",
                  "combo box", "form", "secure", "token field")),
    ("05-collections", ("list", "table", "outline", "grid", "collection",
                        "gallery", "carousel", "tree", "source list")),
    ("03-controls", ("button", "toggle", "switch", "checkbox", "radio", "slider",
                     "stepper", "segmented", "progress", "activity", "picker",
                     "pop-up", "popup", "color well", "disclosure", "rating",
                     "chip", "badge", "control")),
    ("07-system", ("notification", "widget", "dock", "home screen", "app icon",
                   "cursor", "pointer", "spotlight", "lock screen", "siri",
                   "control center", "wallpaper", "menu extra", "touch bar",
                   "system")),
]
FALLBACK = "99-unsorted"


def classify(*candidates: str) -> str:
    for text in candidates:
        low = (text or "").lower()
        if not low:
            continue
        for folder, keywords in BUCKETS:
            if any(k in low for k in keywords):
                return folder
    return FALLBACK


def slug(text: str, maxlen: int = 80) -> str:
    s = text.strip().replace("/", "-").replace("\\", "-")
    s = re.sub(r"[^\w\u4e00-\u9fff.@+ -]", "", s)
    s = re.sub(r"\s+", "-", s).strip("-.")
    return (s or "untitled")[:maxlen]


def load_token(cli: str | None) -> str:
    if cli:
        return cli
    if os.environ.get("FIGMA_TOKEN"):
        return os.environ["FIGMA_TOKEN"]
    for path in (TOKEN_FILE, TOKEN_FILE_ALT):
        if path.exists():
            for line in path.read_text().splitlines():
                if line.startswith("FIGMA_TOKEN="):
                    return line.split("=", 1)[1].strip()
    return ""


# --- api ---------------------------------------------------------------------
def _open(path: str, token: str):
    global CALLS
    CALLS += 1
    req = urllib.request.Request(
        f"{API}{path}",
        headers={"X-Figma-Token": token, "User-Agent": "ui-design-pull/2.0"},
    )
    try:
        return urllib.request.urlopen(req, timeout=600)
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:400]
        raise SystemExit(
            f"[{e.code}] {path}\n{body}\n\n"
            "401/403 = token invalid, expired, or missing file_content:read scope.\n"
            "429 = this file's monthly quota is exhausted; cached raw data is kept."
        )


def get_json(path: str, token: str) -> dict:
    with _open(path, token) as r:
        payload = json.load(r)
    if isinstance(payload, dict) and payload.get("err"):
        raise SystemExit(f"API error on {path}: {payload['err']}")
    return payload


def fetch_components(key: str, token: str, kit: str, raw: Path) -> dict:
    cache = raw / f"{kit}-components.json"
    if cache.exists():
        print(f"· components cache: {cache.relative_to(ROOT)}")
        return json.loads(cache.read_text())
    print("· GET /files/{key}/components   (metered +1)")
    data = get_json(f"/files/{key}/components", token)
    cache.write_text(json.dumps(data, ensure_ascii=False))
    return data


def fetch_tree(key: str, token: str, kit: str, raw: Path) -> dict:
    """Full document tree, streamed to disk once. One metered call."""
    cache = raw / f"{kit}-file.json"
    if cache.exists():
        print(f"· tree cache: {cache.relative_to(ROOT)} ({cache.stat().st_size / 1e6:.1f} MB)")
        return json.loads(cache.read_text())
    print("· GET /files/{key}   (full tree, metered +1, this is the big one)")
    tmp = cache.with_suffix(".part")
    with _open(f"/files/{key}", token) as r, open(tmp, "wb") as f:
        while chunk := r.read(1 << 20):
            f.write(chunk)
    size = tmp.stat().st_size / 1e6
    tmp.rename(cache)
    print(f"  saved {cache.relative_to(ROOT)} ({size:.1f} MB)")
    return json.loads(cache.read_text())


# --- inventory ---------------------------------------------------------------
def walk(node: dict, page: str, depth: int = 0):
    """Yield (page_name, node, depth). Stops at huge depth to stay bounded."""
    if depth > 40:
        return
    yield page, node, depth
    for child in node.get("children") or ():
        yield from walk(child, page, depth + 1)


def rows_from_components(comps: dict) -> list[dict]:
    rows = []
    for node_id, c in comps.items():
        page = ((c.get("containing_frame") or {}).get("pageName") or "").strip()
        name = (c.get("name") or node_id).strip()
        rows.append({"node_id": node_id, "name": name, "page": page or "(no page)",
                     "type": "COMPONENT", "bucket": classify(page, name)})
    return rows


def rows_from_tree(doc: dict, prefer: set[str]) -> tuple[list[dict], dict[str, int]]:
    rows: list[dict] = []
    histogram: dict[str, int] = {}
    root = doc.get("document") or {}
    for page in root.get("children") or ():
        page_name = page.get("name") or "(no page)"
        for _, node, _ in walk(page, page_name):
            t = node.get("type") or "?"
            histogram[t] = histogram.get(t, 0) + 1
            if t in prefer:
                rows.append({
                    "node_id": node.get("id"),
                    "name": (node.get("name") or "untitled").strip(),
                    "page": page_name,
                    "type": t,
                    "bucket": classify(page_name, node.get("name")),
                })
    return rows, histogram


def fetch_image_urls(key: str, token: str, kit: str, ids: list[str], raw: Path,
                     batch: int) -> dict:
    cache = raw / f"{kit}-images.json"
    if cache.exists():
        print(f"· images cache: {cache.relative_to(ROOT)}")
        return json.loads(cache.read_text())
    urls: dict[str, str] = {}
    total = (len(ids) + batch - 1) // batch
    for i in range(0, len(ids), batch):
        chunk = ids[i:i + batch]
        print(f"· GET /images batch {i // batch + 1}/{total} "
              f"({len(chunk)} ids, metered +1)")
        q = urllib.parse.urlencode({"ids": ",".join(chunk), "format": "svg"})
        data = get_json(f"/files/{key}/images?{q}", token)
        urls.update({k: v for k, v in (data.get("images") or {}).items() if v})
        if i + batch < len(ids):
            time.sleep(1.0)
    out = {"images": urls}
    cache.write_text(json.dumps(out, ensure_ascii=False))
    return out


def download(url: str) -> str | None:
    try:
        with urllib.request.urlopen(url, timeout=120) as r:
            return r.read().decode("utf-8", "replace")
    except Exception as e:  # noqa: BLE001
        print(f"  ! download failed: {e}")
        return None


# --- output ------------------------------------------------------------------
def write_index(out: Path, manifest: list[dict]) -> None:
    by_bucket: dict[str, list[dict]] = {}
    for row in manifest:
        by_bucket.setdefault(row["bucket"], []).append(row)
    lines = ["# 组件索引", "", f"共 {len(manifest)} 个组件。", ""]
    for bucket in sorted(by_bucket):
        rows = sorted(by_bucket[bucket], key=lambda r: r["name"].lower())
        lines += [f"## {bucket} ({len(rows)})", "", "| 组件 | 页面 | 类型 | 文件 |", "|---|---|---|---|"]
        for r in rows:
            lines.append(f'| {r["name"]} | {r["page"]} | {r.get("type", "")} | `{r["file"]}` |')
        lines.append("")
    (out / "index.md").write_text("\n".join(lines))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--key", required=True)
    ap.add_argument("--kit", required=True, help="output folder, e.g. macos27 / ios27")
    ap.add_argument("--token", default=None)
    ap.add_argument("--inspect", action="store_true", help="inventory only, export nothing")
    ap.add_argument("--limit", type=int, default=0)
    ap.add_argument("--batch", type=int, default=100, help="ids per /images call")
    ap.add_argument("--types", default="COMPONENT,COMPONENT_SET",
                    help="node types to export (comma separated)")
    args = ap.parse_args()

    out = DATA / "reference" / args.kit
    raw = DATA / "reference" / "_raw"
    raw.mkdir(parents=True, exist_ok=True)

    token = load_token(args.token)
    if not token:
        raise SystemExit(f"FIGMA_TOKEN 未设置。写进 {TOKEN_FILE} 或 export FIGMA_TOKEN=figd_xxx")

    comps = (fetch_components(args.key, token, args.kit, raw).get("meta") or {}).get("components") or {}
    prefer = {t.strip() for t in args.types.split(",") if t.strip()}
    histogram: dict[str, int] = {}

    if comps:
        rows = rows_from_components(comps)
        print(f"· components endpoint: {len(rows)} nodes")
    else:
        print("· components endpoint empty -> falling back to full document tree")
        doc = fetch_tree(args.key, token, args.kit, raw)
        rows, histogram = rows_from_tree(doc, prefer)

    pages: dict[str, int] = {}
    buckets: dict[str, int] = {}
    for r in rows:
        pages[r["page"]] = pages.get(r["page"], 0) + 1
        buckets[r["bucket"]] = buckets.get(r["bucket"], 0) + 1

    print(f"\n=== {args.kit}: {len(rows)} exportable nodes in {len(pages)} pages ===")
    for p, n in sorted(pages.items(), key=lambda kv: -kv[1]):
        print(f"  {n:5d}  {p}")
    if histogram:
        print("\n--- node types in document ---")
        for t, n in sorted(histogram.items(), key=lambda kv: -kv[1])[:15]:
            print(f"  {n:6d}  {t}")
    print("\n--- buckets ---")
    for b, n in sorted(buckets.items()):
        print(f"  {n:5d}  {b}/")
    print(f"\nmetered calls so far: {CALLS}")

    if args.inspect or not rows:
        print("\n(inspect: nothing exported.  add --types FRAME,GROUP or re-run without --inspect)")
        return 0

    todo = rows[: args.limit] if args.limit else rows
    urls = fetch_image_urls(args.key, token, args.kit,
                            [r["node_id"] for r in todo], raw, args.batch)
    out.mkdir(parents=True, exist_ok=True)

    manifest: list[dict] = []
    seen: dict[str, int] = {}
    for r in todo:
        url = urls["images"].get(r["node_id"])
        if not url:
            continue
        svg = download(url)
        if svg is None:
            continue
        folder = out / r["bucket"]
        folder.mkdir(parents=True, exist_ok=True)
        base = f'{slug(r["page"])}__{slug(r["name"])}'
        n = seen.get(base, 0)
        seen[base] = n + 1
        fname = f"{base}.svg" if n == 0 else f"{base}-{n + 1}.svg"
        (folder / fname).write_text(svg)
        manifest.append({**r, "file": f'{r["bucket"]}/{fname}'})

    (out / "MANIFEST.json").write_text(json.dumps({
        "kit": args.kit,
        "file_key": args.key,
        "pulled_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "count": len(manifest),
        "components": manifest,
    }, ensure_ascii=False, indent=2))
    write_index(out, manifest)
    print(f"\nwrote {len(manifest)} svg -> {out.relative_to(ROOT)}/")
    print(f"metered calls total: {CALLS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
