#!/usr/bin/env python3
"""reference/ 数据的共用读取逻辑：分类标签、HIG 映射、令牌页定义、Figma 原始树遍历。
被 gen-docs.py（生成文档）和 build-app-data.py（生成 App 数据）共用。"""
import collections
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]        # 仓库根
DATA = ROOT / "figma"                              # Figma 抓取数据与工具
REF = DATA / "reference"

CATEGORY_LABEL = {
    "00-examples": "示例", "01-navigation": "导航", "02-bars": "栏", "03-controls": "控件",
    "04-input": "输入",
    "05-collections": "集合", "06-overlays": "浮层", "07-system": "系统", "08-tokens": "设计令牌",
    "09-assets": "素材",
}

# kit 页面 → HIG 页面 slug。None = HIG 没有对应页。slug 已逐个请求 HIG JSON 接口确认返回 200。
HIG = {
    "macos27": {
        "Alerts": ["alerts"], "Buttons": ["buttons"], "Color Wells": ["color-wells"],
        "Combo Boxes": ["combo-boxes"], "Disclosure Controls": ["disclosure-controls"],
        "Group Boxes": ["boxes"], "Image Wells": ["image-wells"], "Lists and Tables": ["lists-and-tables"],
        "Menu Bar and Dock": ["the-menu-bar", "dock-menus"], "Menus": ["menus"],
        "Notifications": ["notifications"], "Pointers": ["pointing-devices"],
        "Pop-up and Pull-down Buttons": ["pop-up-buttons", "pull-down-buttons"],
        "Popovers": ["popovers"], "Progress Indicators": ["progress-indicators"],
        "Scrollbar": ["scroll-views"], "Search Fields": ["search-fields"], "Sidebars": ["sidebars"],
        "Segmented Controls": ["segmented-controls"], "Sheets": ["sheets"], "Sliders and Dials": ["sliders"],
        "Steppers": ["steppers"], "Text Fields": ["text-fields"], "Toolbars": ["toolbars"],
        "Toggles": ["toggles"], "Windows": ["windows"], "Colors": ["color"], "Materials": ["materials"],
        "Text Styles": ["typography"],
    },
    "ios27": {
        "Action Sheets": ["action-sheets"], "Activity Views": ["activity-views"], "Alerts": ["alerts"],
        "App Icons": ["app-icons"], "Buttons": ["buttons"], "Color Pickers": ["color-wells"],
        "Contextual Menus": ["context-menus"], "Date and Time Pickers": ["pickers"],
        "Keyboards": ["virtual-keyboards"], "Layout Guides": ["layout"], "Lists": ["lists-and-tables"],
        "Menus": ["menus"], "Notifications": ["notifications"], "Page Controls": ["page-controls"],
        "Popovers": ["popovers"], "Pop-up Buttons": ["pop-up-buttons"],
        "Progress Indicators": ["progress-indicators"], "Segmented Controls": ["segmented-controls"],
        "Sheets": ["sheets"], "Sidebars": ["sidebars"], "Sliders": ["sliders"],
        "Status Bars and Menu Bars": ["status-bars"], "Steppers": ["steppers"], "Tab Bars": ["tab-bars"],
        "Text Fields": ["text-fields"], "Toggles": ["toggles"], "Toolbars": ["toolbars"],
        "Widgets": ["widgets"], "Windows": ["windows"], "Colors": ["color"], "Materials": ["materials"],
    },
}
HIG_URL = "https://developer.apple.com/design/human-interface-guidelines/"

# 不在 kit 里、纯由 tokens/*.json 渲染的附加页
TOKEN_PAGES = [("colors.json", ["colors", "gradients"], "颜色", "纯色与渐变（hex / alpha / 使用次数）"),
               ("typography.json", ["styles"], "文字样式", "字体、字重、字号、行高、字距"),
               ("effects.json", ["effects"], "效果与材质", "模糊、阴影等，BACKGROUND_BLUR 即 Liquid Glass 材质层"),
               ("geometry.json", ["cornerRadii", "itemSpacing", "componentSizes"], "几何", "圆角、间距、组件尺寸分布")]

def walk(node, page, in_set, out):
    t = node.get("type")
    if t == "COMPONENT_SET":
        kids = [c for c in node.get("children", []) if c.get("type") == "COMPONENT"]
        axes = collections.OrderedDict()
        for c in kids:
            for part in re.split(r",\s*", c.get("name", "")):
                if "=" in part:
                    k, v = part.split("=", 1)
                    axes.setdefault(k.strip(), [])
                    if v.strip() not in axes[k.strip()]:
                        axes[k.strip()].append(v.strip())
        kid_info = []
        for c in kids:
            bb = c.get("absoluteBoundingBox") or {}
            kid_info.append({"id": c["id"], "name": c.get("name", ""),
                             "w": bb.get("width"), "h": bb.get("height")})
        out["sets"].append({"page": page, "name": node["name"], "id": node["id"],
                            "variants": len(kids), "axes": axes, "kids": kid_info})
        return
    if t == "COMPONENT" and not in_set:
        bb = node.get("absoluteBoundingBox") or {}
        out["solo"].append({"page": page, "name": node["name"], "id": node["id"],
                            "w": bb.get("width"), "h": bb.get("height")})
    for c in node.get("children") or []:
        walk(c, page, in_set, out)
