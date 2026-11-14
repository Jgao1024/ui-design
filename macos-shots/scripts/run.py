#!/usr/bin/env python3
"""macOS 自带应用批量截图 runner.

用法:
  ./scripts/run.py --apps calculator,finder --themes dark
  ./scripts/run.py --batch 1 --themes dark,light
  ./scripts/run.py --all --themes dark,light

产物:
  shots/<theme>/<NN-slug>/<step>.png      原始窗口截图（2x，无桌面、无阴影）
  structure/<theme>/<NN-slug>/<step>.json AX 树（组件/布局切片的依据）
  logs/manifest-<theme>.csv               每张图的窗口坐标/尺寸/哈希/重复标记
"""
import argparse
import csv
import hashlib
import json
import os
import subprocess
import sys
import time

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BIN = os.path.join(ROOT, "bin", "maccap")
RECIPES = os.path.join(ROOT, "recipes")

TARGET_W, TARGET_H = 1400, 880
TARGET_X, TARGET_Y = 260, 100


def log(msg):
    print(f"[{time.strftime('%H:%M:%S')}] {msg}", flush=True)


def cap(*args, timeout=40):
    try:
        return subprocess.run([BIN, *[str(a) for a in args]],
                              capture_output=True, text=True, timeout=timeout)
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(args, 124, "", "timeout")


def cap_json(*args):
    r = cap(*args)
    out = r.stdout.strip()
    if not out:
        return None
    try:
        return json.loads(out)
    except json.JSONDecodeError:
        return None


def set_theme(theme):
    dark = "true" if theme == "dark" else "false"
    cap_os = subprocess.run(
        ["osascript", "-e",
         f'tell application "System Events" to tell appearance preferences to set dark mode to {dark}'],
        capture_output=True, text=True)
    if cap_os.returncode != 0:
        raise SystemExit(f"切换外观失败: {cap_os.stderr.strip()}")
    time.sleep(1.4)
    read = subprocess.run(["defaults", "read", "-g", "AppleInterfaceStyle"],
                          capture_output=True, text=True)
    cur = "dark" if "Dark" in read.stdout else "light"
    if cur != theme:
        raise SystemExit(f"外观未生效: 期望 {theme}, 实际 {cur}")
    log(f"外观 = {theme}")


def restore_theme():
    subprocess.run(["osascript", "-e",
                    'tell application "System Events" to tell appearance preferences to set dark mode to true'],
                   capture_output=True)


def sha1(path):
    h = hashlib.sha1()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def pid_of(bundle):
    r = cap("pid", bundle)
    return r.stdout.strip() if r.returncode == 0 else None


def launch(recipe):
    if recipe.get("relaunch"):
        p = pid_of(recipe["bundle"])
        if p:
            subprocess.run(["kill", p], capture_output=True)
            for _ in range(24):
                if not pid_of(recipe["bundle"]):
                    break
                time.sleep(0.25)
            time.sleep(0.8)
    args = ["open", "-b", recipe["bundle"]]
    for extra in recipe.get("open_args", []):
        args.append(extra)
    for attempt in range(3):
        subprocess.run(args, capture_output=True)
        for _ in range(24):
            if pid_of(recipe["bundle"]):
                time.sleep(1.2)
                return True
            time.sleep(0.25)
        log(f"  启动重试 {attempt + 2}/3")
    return False


def fit_window(bundle, recipe):
    """尽量统一窗口尺寸；不支持的 app 保留原尺寸并如实记录。"""
    if recipe.get("resize") == "none":
        return None
    got = cap_json("bounds", bundle, TARGET_X, TARGET_Y, TARGET_W, TARGET_H)
    if got and abs(got.get("w", 0) - TARGET_W) <= 24 and abs(got.get("h", 0) - TARGET_H) <= 24:
        return got
    log(f"  AX 设尺寸未生效 ({(got or {}).get('w')}x{(got or {}).get('h')})，尝试拖拽缩放")
    time.sleep(0.4)
    got2 = cap_json("resize", bundle, TARGET_W, TARGET_H)
    if got2 and abs(got2.get("w", 0) - TARGET_W) <= 24 and abs(got2.get("h", 0) - TARGET_H) <= 24:
        return got2
    log(f"  保留应用原生尺寸: {(got2 or got or {}).get('w')}x{(got2 or got or {}).get('h')}")
    return got2 or got


def do_actions(bundle, actions):
    for act in actions:
        if "wait" in act:
            time.sleep(float(act["wait"]))
        elif "key" in act:
            cap("key", bundle, act["key"])
        elif "type" in act:
            cap("type", bundle, act["type"])
        elif "press" in act:
            cap("press", bundle, act["press"][0], act["press"][1])
        elif "pressfirst" in act:
            cap("pressfirst", bundle, act["pressfirst"][0],
                act["pressfirst"][1] if len(act["pressfirst"]) > 1 else "")
        elif "presssub" in act:
            cap("presssub", bundle, act["presssub"])
        elif "click" in act:
            x, y = act["click"]
            cap("click", x, y)
        elif "menu" in act:
            cap("menu", bundle, act["menu"])
        elif "esc" in act:
            cap("esc")


def snap(bundle, path, kind="window"):
    if kind == "menu":
        info = cap_json("shotlayer", bundle, path, 1)
    else:
        info = cap_json("shotf", bundle, path)
    if info and os.path.exists(path) and os.path.getsize(path) > 2000:
        return info
    return None


def run_app(recipe, theme, writer):
    bundle = recipe["bundle"]
    slug = f"{recipe['num']:02d}-{recipe['slug']}"
    outdir = os.path.join(ROOT, "shots", theme, slug)
    struct_dir = os.path.join(ROOT, "structure", theme, slug)
    os.makedirs(outdir, exist_ok=True)
    os.makedirs(struct_dir, exist_ok=True)

    if not launch(recipe):
        log(f"!! {recipe['app']} 启动失败，跳过")
        return {"ok": 0, "fail": 1}
    time.sleep(recipe.get("settle", 2.2))
    cap("activate", bundle)
    time.sleep(0.5)
    if not cap_json("wins", bundle):
        log("  窗口不存在，重新唤起")
        subprocess.run(["open", "-b", bundle], capture_output=True)
        time.sleep(2.4)
        cap("activate", bundle)
        time.sleep(0.6)
    frame = fit_window(bundle, recipe)

    do_actions(bundle, recipe.get("pre_actions", []))
    if recipe.get("pre_actions"):
        time.sleep(recipe.get("pre_settle", 1.6))

    seen = {}
    ok = fail = 0
    for step in recipe["steps"]:
        name = step["name"]
        do_actions(bundle, step.get("actions", []))
        time.sleep(step.get("settle", 0.7))
        path = os.path.join(outdir, f"{name}.png")
        kind = step.get("capture", "window")
        info = snap(bundle, path, kind)
        if not info:
            log(f"  x {slug}/{name} 截图失败")
            fail += 1
            continue
        digest = sha1(path)
        dup = seen.get(digest)
        seen.setdefault(digest, name)
        size_kb = os.path.getsize(path) // 1024
        log(f"  ✓ {slug}/{name} {int(info['w'])}x{int(info['h'])} → {int(info['w'])*2}x{int(info['h'])*2} {size_kb}KB"
            + (f"  [与 {dup} 相同]" if dup else ""))
        writer.writerow({
            "theme": theme, "app": recipe["app"], "slug": slug, "step": name,
            "file": os.path.relpath(path, ROOT),
            "win_x": int(info["x"]), "win_y": int(info["y"]),
            "win_w": int(info["w"]), "win_h": int(info["h"]),
            "sha1": digest, "duplicate_of": dup or "",
            "operation": step.get("op", ""),
        })
        # AX 结构：首步全深度，其余浅一层
        depth = 10 if name == recipe["steps"][0]["name"] else 7
        cap("ax", bundle, depth, os.path.join(struct_dir, f"{name}.json"))
        ok += 1
        if step.get("cleanup"):
            do_actions(bundle, step["cleanup"])
            time.sleep(0.4)
    do_actions(bundle, recipe.get("post_actions", []))
    return {"ok": ok, "fail": fail}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apps", default="")
    ap.add_argument("--batch", default="")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--themes", default="dark")
    ap.add_argument("--keep-theme", action="store_true", help="结束时不再自动切回深色")
    args = ap.parse_args()

    recipes = []
    for fn in sorted(os.listdir(RECIPES)):
        if fn.endswith(".json"):
            with open(os.path.join(RECIPES, fn), encoding="utf-8") as f:
                recipes.append(json.load(f))

    want = {s.strip() for s in args.apps.split(",") if s.strip()}
    if want:
        recipes = [r for r in recipes if r["slug"] in want or r["app"].lower() in want]
    if args.batch:
        recipes = [r for r in recipes if str(r.get("batch")) == args.batch]
    if not recipes:
        raise SystemExit("没有匹配的 recipe")

    themes = [t.strip() for t in args.themes.split(",") if t.strip()]
    total_ok = total_fail = 0
    try:
        for theme in themes:
            set_theme(theme)
            mpath = os.path.join(ROOT, "logs", f"manifest-{theme}.csv")
            new = not os.path.exists(mpath)
            with open(mpath, "a", newline="", encoding="utf-8") as mf:
                w = csv.DictWriter(mf, fieldnames=["theme", "app", "slug", "step", "file",
                                                   "win_x", "win_y", "win_w", "win_h",
                                                   "sha1", "duplicate_of", "operation"])
                if new:
                    w.writeheader()
                for r in recipes:
                    log(f"== {r['num']:02d} {r['app']} ({theme}) ==")
                    res = run_app(r, theme, w)
                    total_ok += res["ok"]
                    total_fail += res["fail"]
                    mf.flush()
    finally:
        if not args.keep_theme:
            restore_theme()
            log("已恢复深色外观")
    log(f"完成: 成功 {total_ok} 张, 失败 {total_fail} 张")


if __name__ == "__main__":
    main()
