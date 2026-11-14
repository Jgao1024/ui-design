#!/usr/bin/env python3
"""生成每个应用的截图 recipe（JSON）。改完这个表重跑本脚本即可。"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "recipes")
ASSET = os.path.join(ROOT, "assets", "sample.png")
DEMO = os.path.join(ROOT, "assets", "demo")

# --- 动作片段 ---------------------------------------------------------------
def wait(s=0.6):
    return {"wait": s}

MAIN = {"name": "01-main", "op": "主窗口默认态", "actions": [wait(0.4)]}

def detail(op="选中列表项", press="AXRow,AXOutlineRow,AXCell,AXListItem", skip="边栏"):
    return {"name": "02-selection", "op": op,
            "actions": [{"pressfirst": [press, skip]}, wait(0.8)]}

def search(op="搜索态", text="a"):
    return {"name": "03-search", "op": op,
            "actions": [{"key": "cmd+f"}, wait(0.5), {"type": text}, wait(0.9)]}

def prefs(op="偏好设置"):
    return {"name": "04-prefs", "op": op,
            "actions": [{"key": "cmd+,"}, wait(1.4)],
            "cleanup": [{"key": "cmd+w"}, wait(0.5)]}

def menu(title="文件", op="菜单展开"):
    return {"name": "05-menu", "op": f"{op}（{title}）",
            "actions": [{"menu": title}, wait(0.6)],
            "capture": "menu", "cleanup": [{"esc": 1}, wait(0.3)]}

def key(name, op, combo, settle=0.9):
    return {"name": name, "op": op, "actions": [{"key": combo}, wait(settle)]}

def newwin(name, op):
    return {"name": name, "op": op, "actions": [{"key": "cmd+n"}, wait(1.3)]}

# --- 应用表 -----------------------------------------------------------------
APPS = [
    # batch 1 试点
    dict(num=1, slug="calculator", app="计算器", bundle="com.apple.calculator", batch=1,
         steps=[MAIN, key("02-scientific", "科学模式", "cmd+2", 1.0),
                menu("显示", "模式菜单")]),
    dict(num=2, slug="finder", app="访达", bundle="com.apple.finder", batch=1,
         open_args=[DEMO], settle=2.6,
         steps=[MAIN, key("02-list", "列表视图", "cmd+2", 1.0),
                key("03-column", "分栏视图", "cmd+3", 1.0),
                {"name": "04-search", "op": "搜索态",
                 "actions": [{"key": "cmd+f"}, wait(0.6), {"type": "ui"}, wait(1.2)]},
                prefs("访达设置")]),
    dict(num=3, slug="system-settings", app="系统设置", bundle="com.apple.systempreferences", batch=1,
         steps=[MAIN, detail("进入子面板", "AXRow,AXCell", "搜索"),
                search("设置内搜索", "声音"), menu("显示", "菜单")]),

    # batch 2 列表 / 文档
    dict(num=4, slug="notes", app="备忘录", bundle="com.apple.Notes", batch=2,
         pre_actions=[{"key": "cmd+n"}, {"wait": 0.6},
                      {"type": "sample note"}, {"key": "return"}],
         steps=[MAIN, search("搜索备注", "a"), prefs()]),
    dict(num=5, slug="textedit", app="文本编辑", bundle="com.apple.TextEdit", batch=2,
         pre_actions=[{"key": "cmd+n"}, {"wait": 0.5},
                      {"type": "设计系统组件清单\n按钮 / 侧栏 / 卡片"}],
         steps=[MAIN, key("02-plain", "纯文本模式", "cmd+shift+t", 1.0),
                search("查找", "abc"), prefs()]),
    dict(num=6, slug="preview", app="预览", bundle="com.apple.Preview", batch=2,
         open_args=[ASSET],
         steps=[MAIN, key("02-annotate", "标记工具栏", "cmd+shift+a", 1.4),
                menu("显示", "菜单")]),
    dict(num=7, slug="reminders", app="提醒事项", bundle="com.apple.reminders", batch=2,
         pre_actions=[{"key": "cmd+n"}, {"wait": 0.8},
                      {"type": "sample reminder"}, {"key": "return"}],
         steps=[MAIN, {"name": "02-add", "op": "新增行输入态",
                       "actions": [{"key": "cmd+n"}, wait(0.5), {"type": "second item"}, wait(0.5)]},
                search("搜索", "a")]),
    dict(num=8, slug="calendar", app="日历", bundle="com.apple.iCal", batch=2,
         steps=[MAIN, key("02-week", "周视图", "cmd+2", 1.0),
                key("03-month", "月视图", "cmd+3", 1.0), prefs()]),
    dict(num=9, slug="contacts", app="通讯录", bundle="com.apple.AddressBook", batch=2,
         pre_actions=[{"key": "cmd+n"}, {"wait": 0.8}],
         steps=[MAIN, search("搜索", "a"), prefs()]),

    # batch 3 媒体 / 通信
    dict(num=10, slug="mail", app="邮件", bundle="com.apple.mail", batch=3,
         steps=[MAIN, detail("选中邮件"), search("搜索邮件", "a"), prefs()]),
    dict(num=11, slug="music", app="音乐", bundle="com.apple.Music", batch=3,
         pre_actions=[{"key": "return"}, {"wait": 1.2}, {"esc": 1}, {"wait": 0.8}],
         steps=[MAIN, key("02-songs", "歌曲列表", "cmd+2", 1.2),
                search("搜索", "a"), prefs()]),
    dict(num=12, slug="podcasts", app="播客", bundle="com.apple.podcasts", batch=3,
         steps=[MAIN, detail("选中节目"), search("搜索", "a"), prefs()]),
    dict(num=13, slug="maps", app="地图", bundle="com.apple.Maps", batch=3,
         steps=[MAIN, key("02-search", "搜索地点", "cmd+f", 0.6),
                {"name": "03-typed", "op": "搜索结果",
                 "actions": [{"type": "coffee"}, wait(0.8), {"key": "return"}, wait(1.6)]},
                menu("显示", "菜单")]),
    dict(num=14, slug="messages", app="信息", bundle="com.apple.MobileSMS", batch=3,
         pre_actions=[{"esc": 1}, {"wait": 1.0}, {"esc": 1}, {"wait": 0.8}],
         settle=3.0,
         steps=[MAIN, search("搜索", "a"), prefs()]),
    dict(num=15, slug="weather", app="天气", bundle="com.apple.weather", batch=3,
         steps=[MAIN, detail("切换城市"), key("03-list", "城市列表", "cmd+2", 1.0),
                menu("显示", "菜单")]),

    # batch 4 工具 / 数据
    dict(num=16, slug="terminal", app="终端", bundle="com.apple.Terminal", batch=4,
         steps=[MAIN, newwin("02-new-window", "新窗口"),
                {"name": "03-command", "op": "执行命令",
                 "actions": [{"type": "ls -la"}, wait(0.3), {"key": "return"}, wait(1.0)]},
                prefs("描述文件")]),
    dict(num=17, slug="console", app="控制台", bundle="com.apple.Console", batch=4,
         steps=[MAIN, detail("选中日志类别"), search("搜索日志", "error")]),
    dict(num=18, slug="activity-monitor", app="活动监视器", bundle="com.apple.ActivityMonitor", batch=4,
         steps=[MAIN, key("02-cpu", "CPU 标签", "cmd+2", 1.0),
                key("03-memory", "内存标签", "cmd+3", 1.0),
                key("04-energy", "能耗标签", "cmd+4", 1.0)]),
    dict(num=19, slug="disk-utility", app="磁盘工具", bundle="com.apple.DiskUtility", batch=4,
         steps=[MAIN, detail("选中宗卷"), menu("文件", "菜单")]),
    dict(num=20, slug="stocks", app="股市", bundle="com.apple.stocks", batch=4,
         pre_actions=[{"pressfirst": ["AXRow,AXCell,AXListItem", ""]}, {"wait": 0.8}],
         steps=[MAIN, search("搜索", "a"), menu("显示", "菜单")]),
    dict(num=21, slug="clock", app="时钟", bundle="com.apple.clock", batch=4,
         steps=[MAIN, key("02-stopwatch", "秒表", "cmd+2", 1.0),
                key("03-timer", "计时器", "cmd+3", 1.0)]),
    dict(num=22, slug="shortcuts", app="快捷指令", bundle="com.apple.shortcuts", batch=4,
         pre_actions=[{"pressfirst": ["AXRow,AXCell,AXListItem", ""]}, {"wait": 0.8}],
         steps=[MAIN, search("搜索", "a"), prefs()]),
    dict(num=23, slug="freeform", app="无边记", bundle="com.apple.freeform", batch=4,
         pre_actions=[{"key": "cmd+n"}, {"wait": 1.4}],
         steps=[MAIN, menu("插入", "插入菜单"), prefs()]),
    dict(num=24, slug="photos", app="照片", bundle="com.apple.Photos", batch=4,
         pre_actions=[{"esc": 1}, {"wait": 0.8}, {"key": "cmd+1"}, {"wait": 0.8}],
         steps=[MAIN, search("搜索", "a"), prefs()]),
]

# batch1 里的行程类补位（保证 batch 2/3/4 每批 6-8 个）
APPS.append(dict(num=25, slug="findmy", app="查找", bundle="com.apple.findmy", batch=3,
                 steps=[MAIN, detail("选中设备"), menu("文件", "菜单")]))
APPS.append(dict(num=26, slug="facetime",
                 app="FaceTime 通话", bundle="com.apple.FaceTime", batch=3,
                 pre_actions=[{"esc": 1}, {"wait": 0.8}],
                 steps=[MAIN, menu("FaceTime 通话", "菜单")]))
APPS.append(dict(num=27, slug="books", app="图书", bundle="com.apple.iBooksX", batch=2,
                 steps=[MAIN, key("02-reading", "阅读目标", "cmd+shift+t", 1.0), prefs()]))


def main():
    os.makedirs(OUT, exist_ok=True)
    keep = {f"{a['num']:02d}-{a['slug']}.json" for a in APPS}
    for fn in os.listdir(OUT):
        if fn.endswith(".json") and fn not in keep:
            os.remove(os.path.join(OUT, fn))
    for a in APPS:
        path = os.path.join(OUT, f"{a['num']:02d}-{a['slug']}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(a, f, ensure_ascii=False, indent=2)
    print(f"生成 {len(APPS)} 个 recipe → {OUT}")


if __name__ == "__main__":
    main()
