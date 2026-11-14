#!/usr/bin/env python3
"""Local receiver for the Figma plugin bridge.

The plugin runs INSIDE Figma (no REST API, no quota) and POSTs SVG batches here.
This server files them into reference/<kit>/svg/<bucket>/ using the same taxonomy
as extract.py, appends every payload to _received.jsonl, then writes a manifest.

  python3 tools/figma-pull/receiver.py            # listens on 127.0.0.1:8917
  python3 tools/figma-pull/receiver.py --port 8917 --verbose
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sys
import time
import urllib.parse
from collections import Counter
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from taxonomy import SKIP_BUCKETS, bucket_for, kit_from_filename, slug  # noqa: E402
from svg_shrink import shrink_svg  # noqa: E402
from svg_trim import content_size, trim_svg  # noqa: E402

ROOT = Path(__file__).resolve().parents[3]
DATA = ROOT / "figma"        # Figma 抓取数据与工具
MAX_BODY = 256 * 1024 * 1024          # 256 MB: 25 SVGs per batch is nowhere near this

# 写盘前的两道处理，都可用命令行关掉
OPT = {"shrink": True, "trim": True}


class Store:
    """Reconstructed from _received.jsonl on startup, so a restart or a re-run
    resumes instead of duplicating. Identity is the Figma node id."""

    def __init__(self) -> None:
        self.ids: dict[str, dict] = {}         # kit -> {node id: file path}
        self.seen: Counter = Counter()         # filename base -> suffix counter
        self.written: Counter = Counter()
        self.skipped = 0
        self.failed: list[dict] = []
        self.kits: Counter = Counter()
        self.saved_bytes = 0                   # 内嵌位图压缩省下的字节
        self.trimmed = 0                       # 被裁掉空白画板的文件数
        self.trim_log: list[dict] = []         # 裁剪明细，写到 _trimmed.jsonl
        self.load()

    def load(self) -> None:
        for jl in (DATA / "reference").glob("*/svg/_received.jsonl"):
            kit = jl.parents[1].name
            ids = self.ids.setdefault(kit, {})
            for line in jl.read_text().splitlines():
                if not line.strip():
                    continue
                try:
                    row = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if row.get("id"):
                    ids[row["id"]] = row.get("file") or ""
                f = (row.get("file") or "").rsplit("/", 1)[-1]
                if f.endswith(".svg"):
                    base = re.sub(r"-\d+\.svg$", "", f[:-4])
                    self.seen[base] += 1
            if ids:
                print(f"· resume {kit}: {len(ids)} nodes indexed")

    def write(self, kit: str, item: dict) -> bool:
        node_id = item.get("id")
        ids = self.ids.setdefault(kit, {})
        if node_id and node_id in ids:
            # only skip if the recorded file is really there -- a gap must be repairable
            recorded = ids[node_id]
            if recorded and (DATA / "reference" / kit / recorded).exists():
                self.skipped += 1
                return False
        page = (item.get("page") or "").strip()
        bucket = bucket_for(page)
        if bucket in SKIP_BUCKETS:
            self.skipped += 1
            return False
        svg = item.get("svg") or ""
        if len(svg) > 5_000_000:
            print(f"· 大文件 {round(len(svg) / 1e6)} MB  ← {item.get('name')}（转码中，请稍候）", flush=True)
        if not svg.lstrip().startswith("<"):
            self.failed.append({"id": node_id, "name": item.get("name"),
                                "why": "empty or non-SVG payload"})
            return False

        folder = DATA / "reference" / kit / "svg" / bucket
        folder.mkdir(parents=True, exist_ok=True)
        base = f'{slug(page)}__{slug(item.get("name") or "untitled")}'
        self.seen[base] += 1
        n = self.seen[base]
        fname = f"{base}.svg" if n == 1 else f"{base}-{n}.svg"
        # 1) 内嵌壁纸/图标压到显示尺寸：33 MB 的桌面壁纸 → ~100 KB
        if OPT["shrink"]:
            svg, before, after = shrink_svg(svg)
            if after < before:
                self.saved_bytes += before - after
        # 2) 画板裁到内容边界：去掉右下角那片空白
        if OPT["trim"]:
            svg, trimmed, dims = trim_svg(svg)
            if trimmed:
                self.trimmed += 1
                self.trim_log.append({"kit": kit, "file": f"svg/{bucket}/{fname}",
                                      "from": [int(dims[0]), int(dims[1])],
                                      "to": [int(round(dims[2])), int(round(dims[3]))]})
        (folder / fname).write_text(svg)
        out_w, out_h = item.get("w"), item.get("h")
        if OPT["trim"]:
            _b = content_size(svg)      # 用裁完的画板尺寸覆盖 Figma 原始外框
            if _b:
                out_w, out_h = _b
        if node_id:
            ids[node_id] = f"svg/{bucket}/{fname}"
        self.written[kit] += 1
        self.kits[kit] += 1
        with open(DATA / "reference" / kit / "svg" / "_received.jsonl", "a") as fh:
            fh.write(json.dumps({
                "id": node_id, "name": item.get("name"), "type": item.get("type"),
                "page": page, "bucket": bucket, "w": out_w, "h": out_h,
                "file": f"svg/{bucket}/{fname}",
            }, ensure_ascii=False) + "\n")
        return True


def master_nodes(kit: str) -> list[dict]:
    """Authoritative master list straight from the cached document tree.

    Mirrors the plugin's walker: stop at COMPONENT_SET (its variants are covered by
    the set) and at COMPONENT; recurse through SECTION / FRAME / GROUP. Going by node
    id sidesteps every page-loading quirk of the plugin API.
    """
    raw = DATA / "reference" / "_raw" / f"{kit}-file.json"
    if not raw.exists():
        return []
    doc = json.loads(raw.read_text())
    out: list[dict] = []

    def rec(node: dict, page: str) -> None:
        for c in node.get("children") or ():
            t = c.get("type")
            if t in ("COMPONENT_SET", "COMPONENT"):
                out.append({"id": c.get("id"), "name": c.get("name") or "untitled",
                            "page": page, "type": t})
                continue
            rec(c, page)

    for page in doc.get("document", {}).get("children") or ():
        name = (page.get("name") or "").strip()
        if bucket_for(name) in SKIP_BUCKETS:
            continue
        rec(page, name)
    return out


STORE = Store()


def build_index(kit: str) -> dict:
    base = DATA / "reference" / kit / "svg"
    rows: list[dict] = []
    jl = base / "_received.jsonl"
    if jl.exists():
        seen = set()
        for line in jl.read_text().splitlines():
            if not line.strip():
                continue
            try:
                row = json.loads(line)
            except json.JSONDecodeError:
                continue
            key = row.get("file")
            if key in seen:
                continue          # last write wins for re-runs
            seen.add(key)
            rows.append(row)
    (base / "MANIFEST.json").write_text(json.dumps({
        "kit": kit, "count": len(rows),
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "items": rows,
    }, ensure_ascii=False, indent=2))

    by_bucket: dict[str, list[dict]] = {}
    for r in rows:
        by_bucket.setdefault(r.get("bucket") or "?", []).append(r)
    lines = [f"# {kit} SVG 索引", "", f"共 {len(rows)} 个组件。", ""]
    for b in sorted(by_bucket):
        group = sorted(by_bucket[b], key=lambda r: (r.get("page") or "", (r.get("name") or "").lower()))
        lines += [f"## {b} ({len(group)})", ""]
        by_page: dict[str, list[dict]] = {}
        for r in group:
            by_page.setdefault(r.get("page") or "?", []).append(r)
        for page in sorted(by_page):
            lines.append(f"### {page}")
            for r in by_page[page]:
                lines.append(f'- {r.get("name")} — `{r.get("file")}`')
            lines.append("")
    (base / "index.md").write_text("\n".join(lines))
    return {"kit": kit, "count": len(rows), "buckets": {b: len(v) for b, v in by_bucket.items()}}


class Handler(BaseHTTPRequestHandler):
    server_version = "ui-design-receiver/1.0"

    def _cors(self) -> None:
        self.send_header("Access-Control-Allow-Origin", "*")
        # Chrome/Electron blocks https->http://127.0.0.1 unless the server opts in
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Max-Age", "86400")

    def _json(self, code: int, payload: dict) -> None:
        body = json.dumps(payload).encode()
        try:
            self.send_response(code)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            # 插件那边超时/崩溃先断了连接。数据已经落盘，不用当成错误。
            sys.stderr.write("· 客户端已断开（数据已写入），忽略\n")

    def do_OPTIONS(self) -> None:                       # noqa: N802
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:                           # noqa: N802
        if self.path.startswith("/nodes"):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            kit = (qs.get("kit") or [""])[0]
            nodes = master_nodes(kit)
            print(f"· /nodes {kit}: {len(nodes)} 个主组件")
            self._json(200, {"ok": True, "nodes": nodes})
            return

        if self.path.startswith("/status"):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            kit = (qs.get("kit") or [""])[0]
            self._json(200, {
                "ok": True,
                "written": dict(STORE.written),
                "skipped": STORE.skipped,
                "failed": len(STORE.failed),
                "ids": sorted(STORE.ids.get(kit, {})) if kit else {},
            })
            return
        body = (
            "<meta charset=utf-8><body style='font:14px -apple-system;padding:24px'>"
            "<h2>Figma 桥接收器运行中</h2>"
            f"<p>已写入：{dict(STORE.written) or '等待插件发送…'}<br>"
            f"跳过：{STORE.skipped} · 失败：{len(STORE.failed)}</p>"
            "<p>回到 Figma，运行插件 <b>UI Design Kit Puller</b> 并点 Start All。</p>"
        ).encode()
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:                          # noqa: N802
        length = int(self.headers.get("Content-Length") or 0)
        if length > MAX_BODY:
            self._json(413, {"ok": False, "err": "payload too large"})
            return
        try:
            payload = json.loads(self.rfile.read(length) or b"{}")
        except Exception as e:                           # noqa: BLE001
            self._json(400, {"ok": False, "err": f"bad json: {e}"})
            return

        route = self.path.split("?")[0]

        if route == "/batch":
            kit = payload.get("kit") or "unknown"
            items = payload.get("items") or []
            added = sum(1 for it in items if STORE.write(kit, it))
            self._json(200, {"ok": True, "added": added, "got": len(items)})
            return

        if route == "/failure":
            kit = payload.get("kit") or "unknown"
            folder = DATA / "reference" / kit / "svg"
            folder.mkdir(parents=True, exist_ok=True)
            with open(folder / "_failures.jsonl", "a") as fh:
                fh.write(json.dumps(payload, ensure_ascii=False) + "\n")
            self._json(200, {"ok": True})
            return

        if route == "/done":
            kits = payload.get("kits") or list(STORE.kits) or ["unknown"]
            summary = [build_index(k) for k in kits]
            # 裁剪明细落到 _trimmed.jsonl，方便事后抽查
            for kit in kits:
                log = [r for r in STORE.trim_log if r["kit"] == kit]
                if not log:
                    continue
                folder = DATA / "reference" / kit / "svg"
                folder.mkdir(parents=True, exist_ok=True)
                with open(folder / "_trimmed.jsonl", "w") as fh:
                    for row in log:
                        fh.write(json.dumps(row, ensure_ascii=False) + "\n")
            self._json(200, {"ok": True, "summary": summary,
                             "trimmed": STORE.trimmed,
                             "saved_mb": round(STORE.saved_bytes / 1024 / 1024, 1)})
            return

        self._json(404, {"ok": False, "err": f"no route {route}"})

    def log_message(self, fmt: str, *args) -> None:      # quieter default log
        if "--verbose" in sys.argv:
            sys.stderr.write("%s %s\n" % (time.strftime("%H:%M:%S"), fmt % args))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8917)
    ap.add_argument("--host", default="127.0.0.1")
    ap.add_argument("--no-shrink", action="store_true", help="不压缩内嵌壁纸/图标")
    ap.add_argument("--no-trim", action="store_true", help="不裁空白画板")
    ap.add_argument("--fresh", action="store_true",
                    help="清空两个 kit 的 svg 目录后重来（保证重拉一遍不产生重复文件）")
    ap.add_argument("--verbose", action="store_true")
    args = ap.parse_args()

    OPT["shrink"] = not args.no_shrink
    OPT["trim"] = not args.no_trim

    if args.fresh:
        for kit in ("macos27", "ios27"):
            folder = DATA / "reference" / kit / "svg"
            if folder.exists():
                shutil.rmtree(folder)
                print(f"· 已清空 {folder.relative_to(ROOT)}")
        STORE.__init__()                       # 重新从空目录载入索引
        print("· --fresh：从零开始，不会产生 -2 / -3 这类重复文件")

    srv = ThreadingHTTPServer((args.host, args.port), Handler)
    print(f"receiver: http://{args.host}:{args.port}")
    print(f"  写盘前处理：压缩={'开' if OPT['shrink'] else '关'}  裁剪={'开' if OPT['trim'] else '关'}")
    print("  GET  /        状态页")
    print("  POST /batch   收 SVG 批次")
    print("  POST /done    写 MANIFEST + index.md + _trimmed.jsonl")
    print("Ctrl-C 结束。")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nbye")
    return 0


if __name__ == "__main__":
    sys.exit(main())
