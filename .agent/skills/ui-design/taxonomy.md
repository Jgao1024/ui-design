# Prototype taxonomy

First level: platform (`ios27`, `macos27`). Second level: group. Third level: one page per
component family, named after the Figma page it comes from. Page path:
`design/system/<kit>/pages/<group>/<page>.tsx`.

The groups refine Figma's 8 buckets (`figma/tools/figma-pull/taxonomy.py`) so that one
group holds a handful of related families. Figma pages keep their own names, so every
page traces back to `figma/reference/<kit>/index.md`.

| Group | Holds |
|---|---|
| `01-windows-navigation` | windows, sidebars, tab bars |
| `02-bars` | toolbars, status bars, menu bar, dock |
| `03-buttons` | buttons, pop-up and pull-down buttons, disclosure |
| `04-selection` | toggles, checkboxes, radio buttons, segmented controls, steppers, page controls |
| `05-sliders-progress` | sliders, dials, progress indicators, scrollbars |
| `06-pickers` | color pickers and wells, date and time pickers, combo boxes, image wells |
| `07-text-input` | text fields, search fields, forms, keyboards |
| `08-lists` | lists, tables, outline, group boxes |
| `09-menus` | menus, context menus, edit menu |
| `10-alerts-sheets` | alerts, dialogs, action sheets, sheets, popovers, tooltips, activity views |
| `11-system-surfaces` | notifications, widgets, app icons, pointers, Face ID, empty states, system UI, device bezels |
| `12-materials-tokens` | Liquid Glass, scroll edge effects, colors, typography, layout guides |
| `13-examples` | whole-screen compositions (Figma `Examples` page) |

## iOS 27 (`ios27`)

Large Figma pages are split into several files so that one page holds one family at a readable size.

| Group | Figma pages → page files |
|---|---|
| 01 | Windows → `windows`, Sidebars → `sidebars` and `sidebar-rows`, Tab Bars → `tab-bars`, `tab-bars-minimized`, `tab-bars-ipad`, `tab-bars-duo` |
| 02 | Toolbars → `toolbars` and `toolbar-items`, Status Bars and Menu Bars → `status-bars` |
| 03 | Buttons → `buttons` (glass buttons, labels) and `buttons-content-area`, Pop-up Buttons → `pop-up-buttons` |
| 04 | Toggles → `toggles`, Segmented Controls → `segmented-controls`, Steppers → `steppers`, Page Controls → `page-controls` |
| 05 | Sliders → `sliders`, Progress Indicators → `progress-indicators` |
| 06 | Color Pickers → `color-pickers`, Date and Time Pickers → `date-time-pickers` |
| 07 | Text Fields → `text-fields`, Keyboards → `keyboards-iphone`, `keyboards-ipad`, `keyboard-accessory-bars` |
| 08 | Lists → `lists` and `list-sections` (headers, swipe actions, index bar) |
| 09 | Menus → `menus` (menu and edit menu), Contextual Menus → `context-menus` |
| 10 | Alerts → `alerts`, Action Sheets → `action-sheets`, Sheets → `sheets`, Popovers → `popovers`, Activity Views → `activity-views` |
| 11 | Notifications → `notifications`, Widgets → `widgets`, App Icons → `app-icons`, Face ID → `face-id`, Empty States → `empty-states`, System → `system`, Product Bezels → `bezels` |
| 12 | Materials → `liquid-glass`, Colors → `colors`, Layout Guides → `layout-guides`, text styles → `typography` |
| 13 | Examples → `examples-home`, `examples-apps`, `examples-overlays` |

## macOS 27 (`macos27`)

| Group | Figma pages → page files |
|---|---|
| 01 | Windows → `windows`, Sidebars → `sidebars` |
| 02 | Toolbars → `toolbars`, Menu Bar and Dock → `menu-bar-dock` |
| 03 | Buttons → `buttons`, Pop-up and Pull-down Buttons → `pop-up-pull-down-buttons`, Disclosure Controls → `disclosure-controls` |
| 04 | Toggles → `toggles`, Segmented Controls → `segmented-controls`, Steppers → `steppers` |
| 05 | Sliders and Dials → `sliders-dials`, Progress Indicators → `progress-indicators`, Scrollbar → `scrollbars` |
| 06 | Color Wells → `color-wells`, Combo Boxes → `combo-boxes`, Image Wells → `image-wells` |
| 07 | Text Fields → `text-fields`, Search Fields → `search-fields`, Forms → `forms` |
| 08 | Lists and Tables → `lists-tables`, Group Boxes → `group-boxes` |
| 09 | Menus → `menus` |
| 10 | Alerts → `alerts`, Dialogs → `dialogs`, Sheets → `sheets`, Popovers → `popovers`, Tooltips → `tooltips` |
| 11 | Notifications → `notifications`, Pointers → `pointers`, Product Bezels → `bezels` |
| 12 | Materials → `liquid-glass`, Colors → `colors`, text styles → `typography` |
| 13 | Examples → `examples` |

Pages that a platform does not have stay absent. Do not add an iOS page to macOS to make
the lists match.
