# macOS 27 组件登记表

> 本文件由 `Figma/tools/gen-docs.py` 生成，第 5 节的清单**不要手改**；其余章节的文字改脚本里的 TEMPLATE 后重新生成。
> 数据源：`Figma/reference/macos27/`（Apple 官方 macOS 27 UI Kit 抽取）。生成时间以数据为准，无时间戳。

## 1. 文档分工与范围

- 本文是 macOS 27 的**组件登记表**：列出 Figma kit 里**全部**页面、组件族、独立组件、内部件，登记名称、nodeId、变体、属性轴、HIG 链接和 **SwiftUI 对应**（见第 5 节）。以后写业务代码，先查这里。
- **原生 SwiftUI App** 的需求见 [native-macos-app.md](native-macos-app.md)，实现进度登记在 `native/macos/IMPLEMENTATION.md`。
- **网页版**（`apps/macos`，TypeScript，已完成并保留）的需求就是本文第 2、3、8 节，原生版不适用这三节。
- 本文档只管 macOS 27。另一个平台有独立文档，两边代码、数据、目录完全独立，互不依赖。
- 数据规模：**38 个展示页面**（8 个分类），**74 个公开组件族**，45 个独立组件，909 个变体，65 个内部件（默认隐藏）。

## 2. 切换与导航（网页版，已完成）

1. **右下角浮窗按钮**：固定在视口右下角，任何页面都可见。点击打开面板，也可按 `⌘K`。
2. **面板内容**：顶部搜索框；下面按 8 个分类分组列出所有页面，每项显示公开组件族数量。搜索范围是页面名和公开族名。`↑` `↓` 选择，`Enter` 跳转，`Esc` 关闭。
3. **快速翻页**：`←` `→` 切到上一页或下一页，顺序与第 5 节一致，首尾循环。
4. **地址可分享**：URL 用 hash 路由，`#/<页面slug>` 和 `#/<页面slug>/<族nodeId>`（nodeId 里的 `:` 换成 `-`）。刷新后停留在原位置。
5. **全局明暗开关**：浮窗面板里放一个 Light / Dark / 跟随系统 开关，默认跟随系统。

## 3. 页面布局规则（网页版，已完成）

1. 页面顶部：页面名、所属分类、HIG 链接（见第 5 节）、族数与变体数。
2. 每个公开族一个区块：标题 + 变体数 + 变体网格。
3. **属性轴 → 网格**：
   - 含 `Light` / `Dark` 值的轴（通常叫 `Mode`）由全局明暗开关控制，不占网格。macOS 的 `Mode` 值基本是 Light / Dark。
   - 其余轴按第 5 节表格中出现的顺序：第 1 个轴作列，第 2 个轴作行，第 3 个及以后的轴拆成多个带标题的子网格。
4. **变体单元格**：图（SVG）+ 轴值标签。点击打开右侧**只读规格面板**：尺寸、圆角、颜色（hex）、字体、效果，数据来自 `specs/*.json`。
5. **SVG 未就绪时**：显示灰色占位矩形，尺寸取变体 bbox，附标签。SVG 导出完成后重跑数据脚本即可替换，无需改前端代码。
6. 页面末尾依次放：**独立组件**（不属于任何族，平铺）、**内部件**（以 `_` 开头，默认折叠，有开关展开）。
7. **整屏类大图缩放到适应单元格宽度**（fit-to-width），不出现横向滚动条。
8. 变体最多的族见下表，渲染要保证流畅：

| 页面 | 族 | 变体数 |
|---|---|---|
| Sidebars | Item | 90 |
| Buttons | Buttons | 72 |
| Sliders and Dials | Slider | 60 |
| Sliders and Dials | Slider - Center-biased | 60 |
| Windows | Windows - Composed | 48 |

## 4. 数据来源与匹配规则

| 内容 | 位置 | 说明 |
|---|---|---|
| 组件族清单与层级 | `Figma/reference/_raw/macos27-file.json` | **只有这里有族 → 变体的关系**（`COMPONENT_SET` 的子节点） |
| 变体规格 | `Figma/reference/macos27/specs/<分类>/*.json` | 每变体一个文件，字段见 `layout`、`textStyles`、`descendants` |
| 变体图 | `Figma/reference/macos27/svg/<分类>/*.svg` | 与 `specs/` 一一对应（族和变体各一个），由 Figma 插件导出，**目前为 0 个** |
| 令牌 | `Figma/reference/macos27/tokens/*.json` | 颜色、文字、效果、几何 |

- **匹配键一律用 nodeId**。规格文件名不唯一（同名会加 `-2` 后缀），也不包含族名，不能靠文件名匹配。
- 开发第一步写一个数据脚本（放在该 App 自己的目录里，可只读引用 `Figma/tools/refdata.py`），把以上数据汇总成精简 JSON 放进 App 的 `public/data/`，App 运行时只读这份 JSON，不直接读 `Figma/reference/`。
- `Figma/reference/` 与 SVG 来自 Apple 素材，**不入 git、不发布**；生成的 JSON 同理加入 `.gitignore`。

## 5. 组件清单（脚本生成）

约定：族表的「属性轴」写作 `轴名: 值1, 值2 …`，`…+N` 表示还有 N 个值；`nodeId` 是族的唯一标识。

**SwiftUI 对应**写在每个页面的第一行，分五级（API 名称已在 Xcode 27.2 SDK 里核对存在）：

| 级别 | 含义 |
|---|---|
| 原生 | SwiftUI 公开 API 直接渲染系统真实外观 |
| 桥接 | SwiftUI 没有对应控件，需要 AppKit / UIKit 包装 |
| 部分 | 一部分用真实控件，一部分只能自绘 |
| 自绘 | 由系统进程绘制，App 拿不到真实控件，只能用 SwiftUI 模拟外观 |
| 不做 | 没有对应 API，也不是控件（如设备外框） |

页面级别分布：原生 30　桥接 2　部分 2　自绘 1　不做 1

### 00-examples 示例

#### Examples

SwiftUI：**未登记**　用法示例板，非组件

HIG：无对应 HIG 页　|　公开族 0 · 独立组件 26 · 变体 0 · 内部件 0

独立组件：Examples/Utility Window `4440:8166`；Examples/Utility Window `4440:8167`；Examples/Windows/Default with Titlebar and Sidebar `4440:8164`；Examples/Windows/Unified Compact Toolbar + Title `4440:8162`；Examples/Windows/Expaned Toolbar + Title `4440:8160`；Examples/Windows/Unified Toolbar + Title `4440:8158`；Examples/Windows/Default with Titlebar and Sidebar `4440:8165`；Examples/Windows/Unified Compact Toolbar + Title `4440:8163`；Examples/Windows/Expaned Toolbar + Title `4440:8161`；Examples/Windows/Unified Toolbar + Title `4440:8159`；Examples/Notifications `4440:8156`；Examples/Notifications `4440:8157`；Examples/Menubar `4440:8154`；Examples/Menubar `4440:8155`；Examples/List `4440:8151`；Examples/Form `4440:8150`；Examples/List `4440:8153`；Examples/Form `4440:8152`；Examples/Dialog/Save - Large `4440:8147`；Examples/Dialog/Save - Small `4440:8146`；Examples/Dialog/Save - Large `4440:8149`；Examples/Dialog/Save - Small `4440:8148`；Examples/Alert/Side-by-side - Window Modal `4440:8143`；Examples/Alert/Side-by-side `4440:8142`；Examples/Alert/Side-by-side - Window Modal `4440:8145`；Examples/Alert/Side-by-side `4440:8144`

### 01-navigation 导航

#### Sidebars

SwiftUI：**原生**　`NavigationSplitView`、`List` + `.listStyle(.sidebar)`、`.inspector`

HIG：[sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)　|　公开族 5 · 独立组件 0 · 变体 121 · 内部件 5

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Item | 90 | Size: Large, Medium, Small · Active: False, True · State: Disabled, Selected, Idle · Level: 4, 3, 2, 1, 0 | `655:2306` |
| Section Header | 24 | Mode: Dark, Light · Size: Small, Medium, Large · First Section: True, False · Active: True, False | `195:8503` |
| Sidebars - Composed | 3 | Size: Large, Medium, Small | `656:3559` |
| Window Controls | 2 | Toolbar Style: Compact, Default | `4358:9901` |
| BG | 2 | Active: True, False | `4362:1751` |

<details><summary>内部件 5 个（默认隐藏）</summary>

_Disclosure - Header；_Disclosure - Folder；_Detail；_Selection；_Leading

</details>

#### Windows

SwiftUI：**原生**　`WindowGroup`、`Window`、`.windowToolbarStyle`、`NavigationSplitView`

HIG：[windows](https://developer.apple.com/design/human-interface-guidelines/windows)　|　公开族 6 · 独立组件 1 · 变体 66 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Window BG | 4 | Mode: Dark, Light · Active: True, False | `683:16442` |
| Window Controls/Standard | 4 | Mode: Dark, Light · Active: False, True | `488:17656` |
| Window Controls/Utility | 4 | Mode: Light, Dark · Active: False, True | `488:17661` |
| Window Titles/Window | 4 | Mode: Light, Dark · With Sidebar: False, True | `4358:16748` |
| Windows - Composed | 48 | Mode: Dark, Light · Active: False, True · Window Type: Expanded Toolbar + Title + Sidebar, Unified Compact Toolbar + Title + Sidebar, Unified Toolbar + Title + Sidebar, Default + Title + Sidebar, Expanded Toolbar without Title, Unified Compact Toolbar without Title …+6 | `4363:18459` |
| Utility Panel | 2 | Mode: Dark, Light | `4374:54811` |

独立组件：Window Titles/Utility Panel `650:5930`

### 02-bars 栏

#### Menu Bar and Dock

SwiftUI：**部分**　菜单栏用 `MenuBarExtra`、`.commands`、`CommandMenu`；Dock 与桌面壁纸无 API，只能自绘

HIG：[the-menu-bar](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar) · [dock-menus](https://developer.apple.com/design/human-interface-guidelines/dock-menus)　|　公开族 5 · 独立组件 0 · 变体 10 · 内部件 7

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Desktop Wallpaper | 2 | Color Mode: Light, Dark | `121:13310` |
| Menu Bar | 2 | Color Mode: Over Dark, Over Light | `121:13196` |
| Desktop Template | 2 | Color Mode: Dark, Light | `121:13243` |
| Dock | 2 | Mode: Dark, Light | `4355:8233` |
| Dock Icon | 2 | Mode: Light, Dark | `4355:8583` |

<details><summary>内部件 7 个（默认隐藏）</summary>

_Menu Bar/Menu Item / Dark；_Menu Bar/Menu Item / Light；_Menu Bar/App Name / Dark；_Menu Bar/App Name / Light；_Menu Bar/Apple Menu/Light；_Menu Bar/Apple Menu/Dark；_System App Icon

</details>

#### Toolbars

SwiftUI：**原生**　`.toolbar`、`ToolbarItem`、`ToolbarItemGroup`、`.windowToolbarStyle`

HIG：[toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)　|　公开族 6 · 独立组件 1 · 变体 112 · 内部件 4

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Segmented Control | 8 | Mode: Light, Dark · Size: Medium, XL · Active: False, True | `121:11848` |
| Button Group | 8 | Mode: Dark, Light · Size: Medium, XL · Active: False, True | `647:1886` |
| Button | 16 | Mode: Dark, Light · Size: Medium, XL · Active: False, True · State: Disabled, Idle | `648:4796` |
| Search | 48 | Mode: Dark, Light · Size: Medium, XL · Active: False, True · State: Value + Disabled, Placeholder + Disabled, Focused, Typing, Value, Placeholder | `177:10807` |
| Pull Down Button | 16 | Mode: Dark, Light · Size: Medium, XL · Active: False, True · State: Idle, Disabled | `641:1584` |
| Pop-Up Button | 16 | Mode: Dark, Light · Size: Medium, XL · Active: False, True · State: Idle, Disabled | `641:1685` |

独立组件：Utility Panel Tab Bar `204:9979`

<details><summary>内部件 4 个（默认隐藏）</summary>

_Buttons/XL；_Buttons/Medium；_Separator；_Button - Utility Panel Tab Bar

</details>

### 03-controls 控件

#### Buttons

SwiftUI：**原生**　`Button` + `.buttonStyle(.automatic/.bordered/.borderedProminent/.borderless/.plain/.glass/.glassProminent)`、`.controlSize`、`.buttonBorderShape`、`.tint`、`Button(role: .destructive)`、`.disabled`

HIG：[buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)　|　公开族 3 · 独立组件 0 · 变体 99 · 内部件 6

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Arrow Buttons | 3 | State: Disabled, Clicked, Idle | `483:5553` |
| Buttons | 72 | Active: False, True · Context: Content Area, Over-Glass · State: Disabled, Clicked, Idle · Style: Borderless, Bordered - Prominent (Default) Destructive, Bordered - Prominent (Default) D, Bordered - Destructive, Bordered - Tinted, Bordered · On: False | `121:11923` |
| Buttons - Toggle | 24 | Active: False, True · Context: Content Area, Over-Glass · State: Disabled, Clicked, Idle · On: True, False | `4341:8462` |

<details><summary>内部件 6 个（默认隐藏）</summary>

_Labels - Toggle；_Labels - Borderless；_Labels - Preferred；_Labels - Destructive；_Labels - Tinted；_Label

</details>

#### Color Wells

SwiftUI：**原生**　`ColorPicker`

HIG：[color-wells](https://developer.apple.com/design/human-interface-guidelines/color-wells)　|　公开族 2 · 独立组件 0 · 变体 5 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Color Picker - Wheel | 2 | Color Selected: False, True | `121:12520` |
| Color Picker | 3 | Mode: Light · State: Disabled, Selected, Idle | `4335:11825` |

#### Combo Boxes

SwiftUI：**桥接**　SwiftUI 无组合框，用 `NSComboBox`（`NSViewRepresentable`）

HIG：[combo-boxes](https://developer.apple.com/design/human-interface-guidelines/combo-boxes)　|　公开族 1 · 独立组件 0 · 变体 4 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Combo Box | 4 | State: Disabled, Button Clicked, Field Clicked, Idle | `121:11951` |

#### Disclosure Controls

SwiftUI：**原生**　`DisclosureGroup`

HIG：[disclosure-controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)　|　公开族 1 · 独立组件 0 · 变体 6 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Disclosure Button | 6 | State: Disabled, Clicked, Idle · Disclosed: True, False | `121:12049` |

#### Group Boxes

SwiftUI：**原生**　`GroupBox`

HIG：[boxes](https://developer.apple.com/design/human-interface-guidelines/boxes)　|　公开族 0 · 独立组件 1 · 变体 0 · 内部件 0

独立组件：Group Box `121:11265`

#### Image Wells

SwiftUI：**桥接**　可编辑图片框用 `NSImageView`（`NSViewRepresentable`），拖放用 `.dropDestination`

HIG：[image-wells](https://developer.apple.com/design/human-interface-guidelines/image-wells)　|　公开族 1 · 独立组件 0 · 变体 2 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Image Well | 2 | Enabled: False, True | `121:12528` |

#### Pop-up and Pull-down Buttons

SwiftUI：**原生**　`Picker` + `.pickerStyle(.menu)`、`Menu`

HIG：[pop-up-buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons) · [pull-down-buttons](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons)　|　公开族 2 · 独立组件 0 · 变体 9 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Pop-Up Button | 6 | State: Disabled, Clicked, Idle · Show Label: False, True | `121:11978` |
| Pulldown Button | 3 | State: Disabled, Clicked, Idle | `202:2935` |

#### Progress Indicators

SwiftUI：**原生**　`ProgressView`（线性、圆形、不确定）、`Gauge`

HIG：[progress-indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)　|　公开族 4 · 独立组件 0 · 变体 46 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Circular - Indeterminate ("Spinner") | 2 | Size: Small, Large | `4349:11606` |
| Circular - Determinate | 20 | Size: Large, Small · Active: False, True · Progress: 100%, 75%, 50%, 25%, 0% | `4349:10450` |
| Linear - Indeterminate | 4 | Size: Small, Medium · Active: True, False | `488:144` |
| Linear - Determinate | 20 | Size: Medium, Small · Active: False, True · Percentage: 0%, 25%, 50%, 75%, 100% | `121:12208` |

#### Scrollbar

SwiftUI：**原生**　`ScrollView`、`.scrollIndicators`；滚动条样式跟随系统设置，不能强制

HIG：[scroll-views](https://developer.apple.com/design/human-interface-guidelines/scroll-views)　|　公开族 2 · 独立组件 0 · 变体 18 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Scrollbar - Vertical | 9 | Page Height: x 8, x 4, x 2 · Position: Bottom, Middle, Top | `497:6481` |
| Scrollbar - Horizontal | 9 | Page: 800%, 400%, 200% · Position: Trailing, Center, Leading | `497:6567` |

#### Segmented Controls

SwiftUI：**原生**　`Picker` + `.pickerStyle(.segmented)`

HIG：[segmented-controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)　|　公开族 1 · 独立组件 0 · 变体 4 · 内部件 3

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Segmented Control | 4 | Active: False, True · Selectable: False, True | `121:12394` |

<details><summary>内部件 3 个（默认隐藏）</summary>

_Separator；_Segment - Not selectable；_Segment - Selectable

</details>

#### Sliders and Dials

SwiftUI：**部分**　滑块用 `Slider`、`Gauge`；旋钮（Dial）用 `NSSlider` 圆形样式桥接

HIG：[sliders](https://developer.apple.com/design/human-interface-guidelines/sliders)　|　公开族 3 · 独立组件 0 · 变体 126 · 内部件 8

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Slider | 60 | Active: True, False · State: Disabled, Clicked, Idle · Ticks: False, True · Value: 100%, 75%, 50%, 25%, 0% · Center-biased: False | `121:12408` |
| Slider - Center-biased | 60 | Active: True, False · State: Disabled, Clicked, Idle · Ticks: False, True · Value: 100%, 75%, 50%, 25%, 0% | `533:3289` |
| Dial (Circular Slider) | 6 | Context: Content Area, Over-Glass · State: Disabled, Clicked, Idle | `121:12063` |

<details><summary>内部件 8 个（默认隐藏）</summary>

_Track Filled；_Track Filled；_Track Unfilled；_Track Unfilled - Center-biased；_Knob；_Slider Midline；_Knob - Clicked - Ticked；_Knob - Clicked - Non-Ticked

</details>

#### Steppers

SwiftUI：**原生**　`Stepper`

HIG：[steppers](https://developer.apple.com/design/human-interface-guidelines/steppers)　|　公开族 3 · 独立组件 0 · 变体 12 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Stepper/No Field | 4 | State: Disabled, Clicked - Down, Clicked - Up, Default | `121:12079` |
| Stepper/Inside Field | 4 | State: Disabled, Clicked - Down, Clicked - Up, Default | `540:1629` |
| Stepper/Outside Field | 4 | State: Disabled, Clicked - Down, Clicked - Up, Default | `540:4659` |

#### Toggles

SwiftUI：**原生**　`Toggle` + `.toggleStyle(.switch/.checkbox/.button)`

HIG：[toggles](https://developer.apple.com/design/human-interface-guidelines/toggles)　|　公开族 3 · 独立组件 0 · 变体 48 · 内部件 4

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Toggles - Switches | 12 | Active: False, True · State: Disabeld, Clicked, Idle · Selection: On, Off | `121:12161` |
| Toggles - Radio Buttons | 18 | Active: False, True · State: Disabled, Clicked, Idle · Selection: Off, Mixed, On | `121:12141` |
| Toggles - Checkboxes | 18 | Active: False, True · State: Disabled, Clicked, Idle · Selection: Off, Mixed, On | `497:3757` |

<details><summary>内部件 4 个（默认隐藏）</summary>

_Knob；_Glyphs - Radio Buttons；_Glyphs - Checkboxes；_Knob Clicked

</details>

### 04-input 输入

#### Forms

SwiftUI：**原生**　`Form`、`.formStyle(.grouped)`、`.formStyle(.columns)`、`LabeledContent`、`Section`

HIG：无对应 HIG 页　|　公开族 2 · 独立组件 2 · 变体 20 · 内部件 3

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Trailing Accessories | 12 | Type: Text Field, Switch, Stepper, Radio Buttons, Pop-Up Button, More Button …+6 | `121:12986` |
| Leading Accessories | 8 | Content: Radio Buttons, Symbol, Disclosure + Large Icon, Disclosure + Small Icon, Checkbox + Large Icon, Checkbox + Small Icon …+2 | `121:12901` |

独立组件：Form `4356:9283`；Form Row `4356:9291`

<details><summary>内部件 3 个（默认隐藏）</summary>

_Left Accessory Icons / 32pt；_Left Accessory Icons / 24pt；_Chevron

</details>

#### Search Fields

SwiftUI：**原生**　`.searchable`、`TextField`

HIG：[search-fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)　|　公开族 1 · 独立组件 0 · 变体 6 · 内部件 2

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Search Field | 6 | State: Disabled, Focused, Idle · Text: True, False | `480:760` |

<details><summary>内部件 2 个（默认隐藏）</summary>

_Clear；_Magnifying Glass

</details>

#### Text Fields

SwiftUI：**原生**　`TextField`、`SecureField`、`TextEditor`、`.textFieldStyle`

HIG：[text-fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)　|　公开族 1 · 独立组件 0 · 变体 6 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Text Field | 6 | State: Disabled, Focused, Idle · Show Text: True, False | `121:12220` |

<details><summary>内部件 1 个（默认隐藏）</summary>

_Input Fields

</details>

### 05-collections 集合

#### Lists and Tables

SwiftUI：**原生**　`List`、`Table`、`.listStyle`、`.alternatingRowBackgrounds()`

HIG：[lists-and-tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)　|　公开族 3 · 独立组件 3 · 变体 24 · 内部件 5

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Sort Order Indicator | 2 | Order: Descending, Ascending | `4356:13719` |
| Table Rows | 20 | Level: 0, 1, 2, 3, 4 · Type: Selected + Active, Selected + Inactive, Alternating Row Color, Default | `4356:11854` |
| Table Rows - Blank | 2 | Alternating Row: True, False | `4356:12135` |

独立组件：Group Title `0:2566`；Column Header `4356:13469`；Outline View `4356:13263`

<details><summary>内部件 5 个（默认隐藏）</summary>

_Column Headers；_Disclosure - Selected；_Disclosure - Unselected；_BG；_Icon

</details>

### 06-overlays 浮层

#### Alerts

SwiftUI：**原生**　`.alert(_:isPresented:actions:message:)`、`.confirmationDialog`（真实弹出，非内联）

HIG：[alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)　|　公开族 1 · 独立组件 1 · 变体 2 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Alert | 2 | Type: Stacked, Side-by-side | `121:11186` |

独立组件：Overlay `4335:347`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Buttons

</details>

#### Dialogs

SwiftUI：**原生**　`.fileImporter`、`.fileExporter`、`.confirmationDialog`

HIG：无对应 HIG 页　|　公开族 0 · 独立组件 3 · 变体 0 · 内部件 0

独立组件：Overlay `682:4331`；Large `174:9424`；Small `171:9049`

#### Menus

SwiftUI：**原生**　`Menu`、`.contextMenu`、`CommandMenu`

HIG：[menus](https://developer.apple.com/design/human-interface-guidelines/menus)　|　公开族 4 · 独立组件 1 · 变体 40 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Menu Background | 2 | Mode: Light, Dark | `4353:2293` |
| Headers | 4 | Mode: Dark, Light · Inset: False, True | `4353:3147` |
| Separators | 2 | Mode: Dark, Light | `4353:3151` |
| Menu Items | 32 | Mode: Light, Dark · State: Disabled, Hover, Hover + Key, Idle · Menu has Selection: True, False · Type: Submenu, Action | `121:12600` |

独立组件：Menu `483:8811`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Shortcuts

</details>

#### Popovers

SwiftUI：**原生**　`.popover(isPresented:)`

HIG：[popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)　|　公开族 1 · 独立组件 1 · 变体 24 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Popover | 24 | Mode: Dark, Light · Edge: Trailing (Bottom), Trailing (Middle), Trailing (Top), Bottom (Trailing), Bottom (Center), Bottom (Leading) …+6 | `121:11291` |

独立组件：Popover `4336:13199`

#### Sheets

SwiftUI：**原生**　`.sheet(isPresented:)`

HIG：[sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)　|　公开族 1 · 独立组件 0 · 变体 2 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Sheet | 2 | Mode: Light, Dark | `4358:15435` |

#### Tooltips

SwiftUI：**原生**　`.help(_:)`

HIG：无对应 HIG 页　|　公开族 0 · 独立组件 1 · 变体 0 · 内部件 1

独立组件：Tooltip `0:2793`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Text

</details>

### 07-system 系统

#### Product Bezels

SwiftUI：**不做**　设备外框，无对应 API

HIG：无对应 HIG 页　|　公开族 1 · 独立组件 0 · 变体 4 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| MacBook Pro PROLED XDR Display | 4 | Size: 14", 16" · Color: Silver, Space Gray | `4490:22142` |

#### Notifications

SwiftUI：**自绘**　通知横幅由系统绘制（`UNUserNotificationCenter`），只能用 SwiftUI 模拟外观

HIG：[notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)　|　公开族 1 · 独立组件 2 · 变体 4 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Notification | 4 | Mode: Dark, Light · Stack: True, False | `4358:11429` |

独立组件：Liquid Glass - Notification - Dark `4358:11539`；Liquid Glass - Notification - Light `4358:11549`

#### Pointers

SwiftUI：**原生**　`.pointerStyle(_:)`

HIG：[pointing-devices](https://developer.apple.com/design/human-interface-guidelines/pointing-devices)　|　公开族 1 · 独立组件 0 · 变体 21 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Pointers | 21 | Type: Resize North-South, Resize West-East, Resize North-East South-West, Resize North-West South-East, Resize (Up-Down), Resize (Left-Right) …+15 | `2302:7096` |

### 08-tokens 设计令牌

#### Colors

SwiftUI：**原生**　`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(nsColor:)`

HIG：[color](https://developer.apple.com/design/human-interface-guidelines/color)　|　公开族 0 · 独立组件 0 · 变体 0 · 内部件 4

<details><summary>内部件 4 个（默认隐藏）</summary>

_Swatch - Light and Dark；_Swatch - Light and Dark (Vibrant)；_Swatch - Text - Light and Dark (Vibrant)；_Swatch - Text - Light and Dark (Vibrant)

</details>

#### Materials

SwiftUI：**原生**　`Material`（`.ultraThinMaterial` 到 `.thickMaterial`、`.bar`）、`.glassEffect(_:in:)`、`GlassEffectContainer`

HIG：[materials](https://developer.apple.com/design/human-interface-guidelines/materials)　|　公开族 6 · 独立组件 0 · 变体 28 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Scroll Edge Effect - Hard | 4 | Mode: Light, Dark · Edge: Bottom, Top | `4363:18594` |
| Scroll Edge Effect - Soft | 2 | Edge: Bottom, Top | `4363:18554` |
| Materials | 10 | Mode: Light, Dark · Type: Ultra Thick, Thick, Medium, Thin, Ultra Thin | `4331:12157` |
| Liquid Glass - Large | 2 | Mode: Dark, Light | `483:9237` |
| Liquid Glass - Medium | 2 | Mode: Dark, Light | `483:9250` |
| Liquid Glass - Small | 8 | Mode: Dark, Light · Active: False, True · State: Primary, Default | `483:9263` |

### 09-assets 素材

#### _Kit

SwiftUI：**未登记**　用法示例板，非组件

HIG：无对应 HIG 页　|　公开族 3 · 独立组件 2 · 变体 40 · 内部件 10

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Segmented Control | 12 | Mode: Dark, Light · Context: Content Area, Over-Glass · State: Disabled, Clicked, Idle | `4348:4764` |
| Glyphs | 12 | Mode: Dark, Light · State: Disabled, Idle · Style: Colored, Neutral, Primary | `4348:5406` |
| Knobs | 16 | Property 1: Over-Glass, Content Area · Property 2: Dark, Light · Property 3: Knobs - Toggle · Property 4: 04 - Disabled, 03 - Clicked, 01 - Idle, 03 - Clicked - Glow, 03 - Clicked - Shadow | `4348:4744` |

独立组件：Header `453:3362`；Content Area/Light/Knobs - Sliders/01 - Idle `4338:10369`

<details><summary>内部件 10 个（默认隐藏）</summary>

_Control BG/Bordered - Prominent - Destructive；_Control BG/Bordered - Prominent；_Control BG/Bordered - Destructive；_Control BG/Bordered - Tinted；_Control BG/Bordered；_Control BG/Bordered - Toggle；_Control BG/Controls；_Tracks - Unfilled；_Tracks - Filled；_Ticks

</details>


## 6. 附加：令牌页

这几页不来自 kit 画板，直接由 `Figma/reference/macos27/tokens/` 渲染，归入分类 `08-tokens`。kit 里同名的 `Colors`、`Materials` 画板页照常展示，二者并存。

- **颜色**（`tokens/colors.json`：colors 194，gradients 12）：纯色与渐变（hex / alpha / 使用次数）。SwiftUI：**原生**　按 hex 渲染色块，对照系统语义色
- **文字样式**（`tokens/typography.json`：styles 69）：字体、字重、字号、行高、字距。SwiftUI：**原生**　`Font`、`Font.TextStyle`，字体用系统 SF
- **效果与材质**（`tokens/effects.json`：effects 132）：模糊、阴影等，BACKGROUND_BLUR 即 Liquid Glass 材质层。SwiftUI：**原生**　`Material`、`.glassEffect`、`.shadow`、`.blur`
- **几何**（`tokens/geometry.json`：cornerRadii 25，itemSpacing 21，componentSizes 200）：圆角、间距、组件尺寸分布。SwiftUI：**原生**　纯数值展示：圆角、间距、尺寸

## 7. 本期不做

HIG 有页面，但 macOS 27 kit 没有对应设计稿，需要另行手绘，**v1 不做**。列表含 watchOS、visionOS、tvOS 专属页，以及另一个平台才有的页，可直接忽略：

[Charts](https://developer.apple.com/design/human-interface-guidelines/charts)、[Image views](https://developer.apple.com/design/human-interface-guidelines/image-views)、[Text views](https://developer.apple.com/design/human-interface-guidelines/text-views)、[Web views](https://developer.apple.com/design/human-interface-guidelines/web-views)、[Collections](https://developer.apple.com/design/human-interface-guidelines/collections)、[Column views](https://developer.apple.com/design/human-interface-guidelines/column-views)、[Labels](https://developer.apple.com/design/human-interface-guidelines/labels)、[Lockups](https://developer.apple.com/design/human-interface-guidelines/lockups)、[Outline views](https://developer.apple.com/design/human-interface-guidelines/outline-views)、[Split views](https://developer.apple.com/design/human-interface-guidelines/split-views)、[Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)、[Activity views](https://developer.apple.com/design/human-interface-guidelines/activity-views)、[Context menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)、[Edit menus](https://developer.apple.com/design/human-interface-guidelines/edit-menus)、[Home Screen quick actions](https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions)、[Ornaments](https://developer.apple.com/design/human-interface-guidelines/ornaments)、[Path controls](https://developer.apple.com/design/human-interface-guidelines/path-controls)、[Tab bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)、[Token fields](https://developer.apple.com/design/human-interface-guidelines/token-fields)、[Action sheets](https://developer.apple.com/design/human-interface-guidelines/action-sheets)、[Page controls](https://developer.apple.com/design/human-interface-guidelines/page-controls)、[Panels](https://developer.apple.com/design/human-interface-guidelines/panels)、[Digit entry views](https://developer.apple.com/design/human-interface-guidelines/digit-entry-views)、[Pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)、[Virtual keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards)、[Activity rings](https://developer.apple.com/design/human-interface-guidelines/activity-rings)、[Gauges](https://developer.apple.com/design/human-interface-guidelines/gauges)、[Rating indicators](https://developer.apple.com/design/human-interface-guidelines/rating-indicators)、[App Shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts)、[Complications](https://developer.apple.com/design/human-interface-guidelines/complications)、[Controls](https://developer.apple.com/design/human-interface-guidelines/controls)、[Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities)、[Snippets](https://developer.apple.com/design/human-interface-guidelines/snippets)、[Status bars](https://developer.apple.com/design/human-interface-guidelines/status-bars)、[Top Shelf](https://developer.apple.com/design/human-interface-guidelines/top-shelf)、[Watch faces](https://developer.apple.com/design/human-interface-guidelines/watch-faces)、[Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets)

## 8. 开发步骤与验收（网页版，已完成）

| 步骤 | 内容 | 验收 |
|---|---|---|
| D1 数据 | 写汇总脚本，生成精简 JSON | 页面数 38、公开族 74、独立组件 45、变体 909 与第 1 节完全一致 |
| D2 外壳 | 浮窗按钮、`⌘K` 面板、搜索、`←` `→`、hash 路由、明暗开关 | 第 5 节每个页面都能从面板到达；刷新后位置不丢 |
| D3 页面 | 按第 3 节渲染所有页面（占位图） | 逐页打开无报错；变体最多的族滚动流畅 |
| D4 规格面板 | 点击变体显示只读规格 | 任选 5 个变体，数值与 `specs/*.json` 一致 |
| D5 SVG | 接入 `svg/`，自动替换占位 | 导出后 Buttons 页显示真实图，其余页不受影响 |

## 9. 已决定

1. 整屏类页面（`Windows`、`Menu Bar and Dock` 等）用 fit-to-width 缩放展示。
2. 内部件不参与全局搜索，只在页面底部手动展开。
