"""Shared taxonomy: Figma page name -> bucket folder. Single source of truth.

Imported by extract.py (JSON specs) and receiver.py (SVG drops) so both land in
exactly the same folders.
"""

from __future__ import annotations

import re

PAGE_BUCKETS: dict[str, tuple[str, ...]] = {
    "08-tokens": ("Colors", "Materials", "Text Styles", "Text Styles and Dynamic Type",
                  "Layout Guides", "Typography"),
    "01-navigation": ("Windows", "Sidebars", "Navigation", "Tab Bars", "Window"),
    "02-bars": ("Toolbars", "Status Bars and Menu Bars", "Menu Bar and Dock", "Bars", "Toolbar"),
    "03-controls": (
        "Buttons", "Color Wells", "Color Pickers", "Combo Boxes", "Disclosure Controls",
        "Group Boxes", "Image Wells", "Pop-up and Pull-down Buttons", "Pop-up Buttons",
        "Progress Indicators", "Scrollbar", "Segmented Controls", "Sliders and Dials",
        "Sliders", "Steppers", "Toggles", "Page Controls", "Activity Views",
        "Empty States", "Switches",
    ),
    "04-input": ("Forms", "Search Fields", "Text Fields", "Keyboards",
                 "Date and Time Pickers", "Text Field"),
    "05-collections": ("Lists and Tables", "Lists", "Tables", "Collections", "Outline"),
    "06-overlays": ("Alerts", "Action Sheets", "Dialogs", "Sheets", "Popovers",
                    "Tooltips", "Contextual Menus", "Menus", "Views", "Overlays"),
    "07-system": ("Notifications", "Pointers", "Product Bezels", "App Icons",
                  "Face ID", "Widgets", "System", "Dock"),
    "00-examples": ("Examples",),
    "09-assets": ("_Kit", "_Kit Helpers"),
    "00-meta": ("Cover", "Getting Started", "Change log", "License",
                "---", "——————————————————"),
}
FALLBACK = "99-unsorted"
SKIP_BUCKETS = {"00-meta"}          # not exported, not counted


def bucket_for(page: str) -> str:
    """Exact match first, then prefix — so 'Color Wells' never lands in 08-tokens."""
    low = (page or "").lower().strip()
    for folder, pages in PAGE_BUCKETS.items():
        if any(low == p.lower() for p in pages):
            return folder
    for folder, pages in PAGE_BUCKETS.items():
        if any(low.startswith(p.lower()) for p in pages if len(p) > 4):
            return folder
    return FALLBACK


def slug(text: str, maxlen: int = 70) -> str:
    s = str(text).strip().replace("/", "-").replace("\\", "-")
    s = re.sub(r"[^\w\u4e00-\u9fff.@+ =,-]", "", s)
    s = re.sub(r"[\s,]+", "-", s).strip("-.")
    return (s or "untitled")[:maxlen]


def kit_from_filename(name: str) -> str:
    low = (name or "").lower()
    if "macos" in low or "mac os" in low:
        return "macos27"
    if "visionos" in low:
        return "visionos"
    if "watchos" in low:
        return "watchos"
    return "ios27"
