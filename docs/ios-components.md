# iOS 27 组件登记表

> 本文件由 `Figma/tools/gen-docs.py` 生成，第 5 节的清单**不要手改**；其余章节的文字改脚本里的 TEMPLATE 后重新生成。
> 数据源：`Figma/reference/ios27/`（Apple 官方 iOS 27 UI Kit 抽取）。生成时间以数据为准，无时间戳。

## 1. 文档分工与范围

- 本文是 iOS 27 的**组件登记表**：列出 Figma kit 里**全部**页面、组件族、独立组件、内部件，登记名称、nodeId、变体、属性轴、HIG 链接和 **SwiftUI 对应**（见第 5 节）。以后写业务代码，先查这里。
- **原生 SwiftUI App** 的需求见 [native-ios-app.md](native-ios-app.md)，实现进度登记在 `native/ios/IMPLEMENTATION.md`。
- **网页版**（`apps/ios`，TypeScript，已完成并保留）的需求就是本文第 2、3、8 节，原生版不适用这三节。
- 本文档只管 iOS 27。另一个平台有独立文档，两边代码、数据、目录完全独立，互不依赖。
- 数据规模：**41 个展示页面**（8 个分类），**106 个公开组件族**，94 个独立组件，634 个变体，135 个内部件（默认隐藏）。

## 2. 切换与导航（网页版，已完成）

1. **右下角浮窗按钮**：固定在视口右下角，任何页面都可见。点击打开面板，也可按 `⌘K`。
2. **面板内容**：顶部搜索框；下面按 8 个分类分组列出所有页面，每项显示公开组件族数量。搜索范围是页面名和公开族名。`↑` `↓` 选择，`Enter` 跳转，`Esc` 关闭。
3. **快速翻页**：`←` `→` 切到上一页或下一页，顺序与第 5 节一致，首尾循环。
4. **地址可分享**：URL 用 hash 路由，`#/<页面slug>` 和 `#/<页面slug>/<族nodeId>`（nodeId 里的 `:` 换成 `-`）。刷新后停留在原位置。
5. **全局明暗开关**：浮窗面板里放一个 Light / Dark / 跟随系统 开关，默认跟随系统。
6. **设备筛选**（仅 iOS）：面板里放 全部 / iPhone / iPad / iPhone Duo，默认 iPhone。族名或独立组件名里含 `iPhone Duo`、`iPad`、`iPhone` 字样的，按筛选显示（先判断 `iPhone Duo`，再判断 `iPad`，最后 `iPhone`）；不含设备词的始终显示。

## 3. 页面布局规则（网页版，已完成）

1. 页面顶部：页面名、所属分类、HIG 链接（见第 5 节）、族数与变体数。
2. 每个公开族一个区块：标题 + 变体数 + 变体网格。
3. **属性轴 → 网格**：
   - 含 `Light` / `Dark` 值的轴（通常叫 `Mode`）由全局明暗开关控制，不占网格。iOS 的 `Mode` 轴值更杂（`Light`、`Dark`、`Default`、`Active`、`Inactive`、`IC - Light`、`IC - Dark`）。**只有同时含 Light 和 Dark 的族**受全局开关控制，其余值留在网格里当普通轴显示。
   - 其余轴按第 5 节表格中出现的顺序：第 1 个轴作列，第 2 个轴作行，第 3 个及以后的轴拆成多个带标题的子网格。
4. **变体单元格**：图（SVG）+ 轴值标签。点击打开右侧**只读规格面板**：尺寸、圆角、颜色（hex）、字体、效果，数据来自 `specs/*.json`。
5. **SVG 未就绪时**：显示灰色占位矩形，尺寸取变体 bbox，附标签。SVG 导出完成后重跑数据脚本即可替换，无需改前端代码。
6. 页面末尾依次放：**独立组件**（不属于任何族，平铺）、**内部件**（以 `_` 开头，默认折叠，有开关展开）。
7. **整屏类大图缩放到适应单元格宽度**（fit-to-width），不出现横向滚动条。
8. 变体最多的族见下表，渲染要保证流畅：

| 页面 | 族 | 变体数 |
|---|---|---|
| Buttons | Button - Content Area | 108 |
| Tab Bars | Tab Bar - iPhone | 24 |
| Tab Bars | Tab Bar - iPhone Duo | 24 |
| Buttons | Button - Liquid Glass - Text | 24 |
| Examples | Examples/Sheets (Modals) | 20 |

## 4. 数据来源与匹配规则

| 内容 | 位置 | 说明 |
|---|---|---|
| 组件族清单与层级 | `Figma/reference/_raw/ios27-file.json` | **只有这里有族 → 变体的关系**（`COMPONENT_SET` 的子节点） |
| 变体规格 | `Figma/reference/ios27/specs/<分类>/*.json` | 每变体一个文件，字段见 `layout`、`textStyles`、`descendants` |
| 变体图 | `Figma/reference/ios27/svg/<分类>/*.svg` | 与 `specs/` 一一对应（族和变体各一个），由 Figma 插件导出，**目前为 0 个** |
| 令牌 | `Figma/reference/ios27/tokens/*.json` | 颜色、文字、效果、几何 |

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

页面级别分布：原生 31　桥接 0　部分 2　自绘 5　不做 1

### 00-examples 示例

#### Examples

SwiftUI：**未登记**　用法示例板，非组件

HIG：无对应 HIG 页　|　公开族 25 · 独立组件 27 · 变体 114 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Examples/Tab Bars | 2 | Type: Without Search, With Search | `12740:23859` |
| Examples/Menus | 2 | Type: Edit Menu, Menu and Submenu | `12740:23879` |
| Examples/Keyboard | 2 | Type: Text (Upper Case), Text (Lower Case) | `12740:23934` |
| Examples/Alert | 2 | Keyboard: True, False | `12740:23974` |
| Examples/Toolbars - Top | 4 | Type: 2 Line - Left Aligned, 2 Line - Center Aligned, 2 Line - Large Title Inline, 2 Line - Large Title | `12740:23811` |
| Examples/Tab Bar | 2 | Split Search: False, True | `12740:24076` |
| Examples/Sheets (Modals) | 3 | Type: Fullscreen, Fullscreen Stack, Inspector | `12740:24097` |
| Examples/Picker | 2 | Type: Inline, Compact | `12740:24134` |
| Examples/Menus | 2 | Type: Edit Medium, Menu | `12740:24156` |
| Examples/List | 3 | Type: Inset, Full Width, Full Width + Section Headers | `12740:24202` |
| Examples/Keyboard | 11 | Type: Lowercase, Uppercase, Punctuation, Numberic, Find, Find and Replace …+5 | `12740:24268` |
| Examples/Empty States | 3 | Config: Title and Subtitle, Symbol in Circle, Large Symbol | `12740:24438` |
| Examples/Toolbars - Bottom | 3 | Type: Search, Symbols, Text | `12740:24038` |
| Examples/Toolbars - Top | 5 | Type: Title 2 Line Left, Title 2 Line, Large Title, Compact Large Title, Default | `12740:23996` |
| Examples/Toolbars | 4 | Screen: Inner, Outer · Orientation: Landscape, Portrait · Type: Full Screen | `12887:23253` |
| Examples/Tab Bars | 4 | Screen: Inner, Outer · Orientation: Landscape, Portrait · Type: Full Screen | `12887:21801` |
| Examples/Sheets (Modals) | 20 | Screen: Inner (Folded), Inner, Outer · Orientation: Landscape, Portrait · Type: Small Detent, Medium Detent, Large Detent, Full Screen | `12886:17616` |
| Examples/Alerts | 5 | Screen: Inner (Folded), Inner, Outer · Orientation: Landscape, Portrait · Type: Full Screen | `12956:22765` |
| Examples/Keyboard | 16 | Screen: Inner, Outer · Orientation: Landscape, Portrait · Type: Punctuation, Numeric, Lowercase, Uppercase | `12891:50098` |
| Examples/Activity View | 4 | Screen: Inner, Outer · Orientation: Landscape, Portrait · Type: Uppercase | `12946:17194` |
| Examples/Notifications | 2 | Expanded: True, False | `12740:24417` |
| Examples/Home Screen Widgets | 4 | Size: Small, Medium, Large, XL | `12740:24470` |
| Examples/Home Screen | 3 | Screen: Inner, Outer · Orientation: Landscape, Portrait | `13159:44042` |
| Examples/Notifications | 2 | Expanded: True, False | `12740:23782` |
| Examples/Home Screen Widgets | 4 | Size: Small, Medium, Large, Extra Large | `12740:23795` |

独立组件：Examples/Sidebar `12740:37613`；Examples/Popover `12740:37608`；Examples/Sheets (Modals) `12740:37607`；Examples/List `12740:37605`；Examples/Context Menu `12740:37612`；Examples/Color Picker `12740:37604`；Examples/Action Sheet `12740:37603`；Examples/Activity View `12740:37606`；Examples/Slider `12740:35186`；Examples/Steppers `12740:35192`；Examples/Face ID `13159:44726`；Examples/Context Menu `12740:35183`；Examples/Color Picker `12740:35184`；Examples/Action Sheet `12740:35185`；Examples/Alert `13159:44659`；Examples/Activity View `12740:35190`；Examples/Text Fields `12740:35194`；Examples/Toggles (Switches) `12740:35193`；Examples/Lock Screen `12740:35191`；Examples/Home Screen Quick Actions `12740:35187`；Examples/Home Screen `12740:35189`；Examples/Control Center `12740:35188`；Examples/Window `12740:37615`；Examples/Lock Screen `12740:37614`；Examples/Home Screen Quick Actions `12740:37610`；Examples/Home Screen `12740:37611`；Examples/Control Center `12740:37609`

### 01-navigation 导航

#### Sidebars

SwiftUI：**原生**　`NavigationSplitView`、`TabView` + `.tabViewStyle(.sidebarAdaptable)`

HIG：[sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars)　|　公开族 3 · 独立组件 2 · 变体 16 · 内部件 7

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| BG | 2 | Active: True, False | `10472:45236` |
| Sidebar Row | 12 | State: Disabled, Disclosable, Selected, Default · Indent Level: 2, 1, 0 | `131:70029` |
| Sidebar | 2 | Floating Window: False, True | `10464:33764` |

独立组件：Section Header `131:66427`；Sidebar Search Field `5840:30516`

<details><summary>内部件 7 个（默认隐藏）</summary>

_Sidebar - Trailing；_Sidebar - Edit Button；_Sidebar - Leading；_Trailing - Disclosure；_Search Field；_Selection BG；_Section Header

</details>

#### Tab Bars

SwiftUI：**原生**　`TabView` + `Tab`、`.tabBarMinimizeBehavior`

HIG：[tab-bars](https://developer.apple.com/design/human-interface-guidelines/tab-bars)　|　公开族 2 · 独立组件 1 · 变体 48 · 内部件 6

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Tab Bar - iPhone | 24 | Minimized: True, False · Tabs: 5, 4, 3, 2 · Type: Prominent Tab, Search Role, Default | `3:70967` |
| Tab Bar - iPhone Duo | 24 | Minimized: True, False · Tabs: 5, 4, 3, 2 · Type: Prominent Tab, Search Role, Default | `12887:20935` |

独立组件：Tab Bar - iPad `2524:7957`

<details><summary>内部件 6 个（默认隐藏）</summary>

_Tab Bar Button - iPad - Text；_Tab Bar Button - iPad - Symbol；_Tab Bar Button Round - iPhone；_Tab Bar Button - iPhone Duo；_Tab Bar Button Round - iPhone Duo；_Tab Bar Button - iPhone

</details>

#### Windows

SwiftUI：**原生**　`WindowGroup`、iPad 多窗口

HIG：[windows](https://developer.apple.com/design/human-interface-guidelines/windows)　|　公开族 1 · 独立组件 1 · 变体 2 · 内部件 2

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Window with Sidebar | 2 | Mode: Inactive, Active | `12492:2483` |

独立组件：Window `5588:3741`

<details><summary>内部件 2 个（默认隐藏）</summary>

_Window Controls；_Window Resize

</details>

### 02-bars 栏

#### Status Bars and Menu Bars

SwiftUI：**自绘**　状态栏由系统绘制，SwiftUI 只能用 `.toolbarVisibility(_:for: .statusBar)` 显隐；其余自绘示意

HIG：[status-bars](https://developer.apple.com/design/human-interface-guidelines/status-bars)　|　公开族 3 · 独立组件 2 · 变体 9 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Status bar and Menu bar- iPad | 4 | Full Screen: False, True · Menu Expanded: True, False · Background: Light | `5413:10006` |
| Status bar - iPhone Duo | 2 | Type: Vertical, Horizontal | `12884:7911` |
| Status Bar - iPhone | 3 | iPhone: iPhone 17 Pro, iPhone 18 Pro Max, iPhone 18 Pro | `12961:29589` |

独立组件：iPad - Leading Accessories `10465:36399`；iPad - Trailing Accessories `10465:36393`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Menu bar item

</details>

#### Toolbars

SwiftUI：**原生**　`.toolbar`、`ToolbarItem(placement:)`、`ToolbarSpacer`、`ToolbarOverflowMenu`

HIG：[toolbars](https://developer.apple.com/design/human-interface-guidelines/toolbars)　|　公开族 4 · 独立组件 1 · 变体 27 · 内部件 19

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Toolbar - Top - iPad | 8 | Style: Compact Large, Large Title, Title 2 Line Left, Title 2 Line · Tab Bar: True, False | `5561:41165` |
| Toolbar - Top - iPhone Duo | 8 | Style: Title 2 Line, Compact Large, Large Title, Title · Sheet: True, False | `12883:6008` |
| Toolbar - Top - iPhone | 5 | Style: Compact Large, Large Title, Title 2 Line Left, Title 2 Line, Default | `1:54472` |
| Toolbar - Bottom - iPhone | 6 | Type: Buttons + Page Dots, Search with Focus, Search + Leading Item, Search + Trailing Item, Search, Buttons | `4:55732` |

独立组件：Toolbar - Bottom - iPad `8515:13163`

<details><summary>内部件 19 个（默认隐藏）</summary>

_Toolbar page control；_Back Bar Button Item；_Button - Text；_Button - Text - Prominent；_Button - Symbol；_Button - Symbol - Prominent；_Segmented Control Button；_Search Accessory；_Search - 44pt；_Buttons - 44pt；_Search - 48pt；_Buttons - 48pt；_Title - iPhone Duo - Large Title；_Title - iPhone - Large Title；_Title - iPhone - Subheadline；_Title - iPhone - Body；_Subtitle - iPhone - Caption；_Subtitle - iPhone - Subheadline；_Page Dots

</details>

### 03-controls 控件

#### Activity Views

SwiftUI：**原生**　`ShareLink`

HIG：[activity-views](https://developer.apple.com/design/human-interface-guidelines/activity-views)　|　公开族 0 · 独立组件 3 · 变体 0 · 内部件 11

独立组件：Overlay `5846:3358`；Activity View - iPad `128:60578`；Activity View `128:58645`

<details><summary>内部件 11 个（默认隐藏）</summary>

_Actions；_Separator；_Close Button；_Button - Liquid Glass；_Action；_App；_Contact；_Header；_Actions；_Apps；_Contacts

</details>

#### Buttons

SwiftUI：**原生**　`Button` + `.buttonStyle(.automatic/.bordered/.borderedProminent/.borderless/.plain/.glass/.glassProminent)`、`.controlSize`、`.buttonBorderShape`、`.tint`、`Button(role: .destructive)`、`.disabled`

HIG：[buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)　|　公开族 3 · 独立组件 0 · 变体 140 · 内部件 4

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Button - Content Area | 108 | Size: Large, Medium, Small · Style: Borderless, Bordered, Bordered - Prominent · Label Style: Icon only, Title only, Title and Icon · Is Enabled: False, True · Destructive: True, False | `40:58696` |
| Button - Liquid Glass - Text | 24 | Size: Small, Medium, Large · Style: Glass, Glass Prominent · Is Enabled: False, True · Destructive: True, False | `5473:21667` |
| Button - Liquid Glass - Symbol | 8 | Style: Glass, Glass Prominent · Is Enabled: False, True · Destructive: True, False | `5522:11866` |

<details><summary>内部件 4 个（默认隐藏）</summary>

_Label - Symbol - Preferred；_Label - Symbol - Default；_Label - Symbol - Destructive Default；_Label - Text

</details>

#### Color Pickers

SwiftUI：**原生**　`ColorPicker`

HIG：[color-wells](https://developer.apple.com/design/human-interface-guidelines/color-wells)　|　公开族 1 · 独立组件 2 · 变体 4 · 内部件 3

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Picker Button | 4 | Size: Large, Small · Selected: True, False | `5739:34128` |

独立组件：Color Picker - iPad `515:56319`；Color Picker - iPhone `0:5275`

<details><summary>内部件 3 个（默认隐藏）</summary>

_Button；_Title；_Toolbar

</details>

#### Empty States

SwiftUI：**原生**　`ContentUnavailableView`

HIG：无对应 HIG 页　|　公开族 1 · 独立组件 0 · 变体 3 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Empty States | 3 | Type: Large Symbol, Symbol in Circle, Title and Subtitle | `5583:24408` |

#### Page Controls

SwiftUI：**原生**　`TabView` + `.tabViewStyle(.page)`

HIG：[page-controls](https://developer.apple.com/design/human-interface-guidelines/page-controls)　|　公开族 1 · 独立组件 0 · 变体 3 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Page Control | 3 | Pages: 1-6, 7, 8+ | `10520:3448` |

<details><summary>内部件 1 个（默认隐藏）</summary>

_Page Indicator

</details>

#### Pop-up Buttons

SwiftUI：**原生**　`Picker` + `.pickerStyle(.menu)`

HIG：[pop-up-buttons](https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons)　|　公开族 1 · 独立组件 0 · 变体 2 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Popup Button | 2 | Is Enabled: True, False | `410:50387` |

#### Progress Indicators

SwiftUI：**原生**　`ProgressView`、`Gauge`

HIG：[progress-indicators](https://developer.apple.com/design/human-interface-guidelines/progress-indicators)　|　公开族 2 · 独立组件 0 · 变体 14 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Progress Bar - Determinate Linear | 11 | Value: 100%, 90%, 80%, 70%, 60%, 50% …+5 | `9:55875` |
| Progress Bar - Indeterminate Circular ("Spinner") | 3 | Size: Small, Regular, Large | `5425:3431` |

#### Segmented Controls

SwiftUI：**原生**　`Picker` + `.pickerStyle(.segmented)`

HIG：[segmented-controls](https://developer.apple.com/design/human-interface-guidelines/segmented-controls)　|　公开族 1 · 独立组件 0 · 变体 4 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Segmented Control | 4 | Size: Small, Large · Is Enabled: True, False | `10460:145` |

<details><summary>内部件 1 个（默认隐藏）</summary>

_Option

</details>

#### Sliders

SwiftUI：**原生**　`Slider`

HIG：[sliders](https://developer.apple.com/design/human-interface-guidelines/sliders)　|　公开族 1 · 独立组件 0 · 变体 15 · 内部件 5

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Sliders | 15 | State: Disabled, Idle, Pressed · Value: 100%, 75%, 50%, 25%, 0% | `7:53847` |

<details><summary>内部件 5 个（默认隐藏）</summary>

_Ticks；_Track；_Fill；_Knob - Idle；_Knob - Pressed

</details>

#### Steppers

SwiftUI：**原生**　`Stepper`

HIG：[steppers](https://developer.apple.com/design/human-interface-guidelines/steppers)　|　公开族 0 · 独立组件 1 · 变体 0 · 内部件 2

独立组件：Stepper `5415:17699`

<details><summary>内部件 2 个（默认隐藏）</summary>

_Decrement；_Increment

</details>

#### Toggles

SwiftUI：**原生**　`Toggle`

HIG：[toggles](https://developer.apple.com/design/human-interface-guidelines/toggles)　|　公开族 1 · 独立组件 0 · 变体 8 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Toggle - Switch | 8 | State: Idle, Pressed · Is On: False, True · Is Enabled: False, True | `29:56814` |

### 04-input 输入

#### Date and Time Pickers

SwiftUI：**原生**　`DatePicker`（`.compact`、`.graphical`、`.wheel`）

HIG：[pickers](https://developer.apple.com/design/human-interface-guidelines/pickers)　|　公开族 2 · 独立组件 0 · 变体 4 · 内部件 2

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Date and time - Collapsed | 2 | State: Default, Selected | `30:53803` |
| Date and time - Pickers | 2 | Style: Inline, Compact | `5442:1885` |

<details><summary>内部件 2 个（默认隐藏）</summary>

_Day；_Week

</details>

#### Keyboards

SwiftUI：**部分**　键盘本体由系统绘制，用 `TextField` + `.keyboardType` 触发真实键盘；配件栏用 `ToolbarItemGroup(placement: .keyboard)`

HIG：[virtual-keyboards](https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards)　|　公开族 9 · 独立组件 0 · 变体 41 · 内部件 26

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Accessory Bar - iPhone/Search | 2 | Mode: Dark, Light | `12892:51480` |
| Accessory Bar - iPhone/Toolbar | 4 | Mode: Dark, Light · Type: Button Group, Button | `5522:14771` |
| Accessory Bar - iPhone/Find | 2 | Mode: Dark, Light | `5720:47982` |
| Accessory Bar - iPhone/URL | 2 | Mode: Dark, Light | `6334:12943` |
| Accessory Bar - iPhone/Web Form | 2 | Mode: Dark, Light | `6334:13068` |
| Accessory Bar - iPhone/Find and Replace | 2 | Mode: Dark, Light | `5720:48008` |
| Keyboard | 9 | Type: Upper Case, Lower Case, Numeric, Punctuation, Email, URL …+3 | `106:60296` |
| Keyboard | 16 | Display: Inner, Outer · Orientation: Landscape, Portrait · Type: Punctuation, Numeric, Lower Case, Upper Case | `12890:26716` |
| Keyboard | 2 | Type: Shift, Default | `128:78692` |

<details><summary>内部件 26 个（默认隐藏）</summary>

_Autocorrection；_Suggestion；_Number Pad；_Keys - iPhone；_Previous；_Next；_Symbol；_Field - BG；_Field - Find；_Field - Replace；_Replace Button；_Button - Symbol Keyboard；_Bottom Buttons；_Emoji Tabs；_Search Emoji；_Keys - iPhone Duo；_Bottom Buttons；_Background - Keyboard；_Accessory Bar - iPad - Buttons/Light；_Accessory Bar - iPad - Buttons/Dark；_Keys - iPad - Command；_Keys - iPad - Return；_Keys - iPad - Lowercase；_Keyboard Layouts/iPad/Lowercase；_Accessory Bar - iPad；_Keyboard Layouts/iPad/Uppercase

</details>

#### Text Fields

SwiftUI：**原生**　`TextField`、`SecureField`、`TextEditor`

HIG：[text-fields](https://developer.apple.com/design/human-interface-guidelines/text-fields)　|　公开族 1 · 独立组件 0 · 变体 4 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Text Field | 4 | State: Placeholder, Focused, Value Entered, Typing | `553:23047` |

### 05-collections 集合

#### Lists

SwiftUI：**原生**　`List`、`.listStyle(.insetGrouped/.plain/.grouped)`、`Section`

HIG：[lists-and-tables](https://developer.apple.com/design/human-interface-guidelines/lists-and-tables)　|　公开族 5 · 独立组件 2 · 变体 16 · 内部件 10

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Row - Button | 3 | Value: Disabled, Destructive, Default | `550:49677` |
| Row | 2 | Height: Tall, Regular | `550:50430` |
| Index Bar | 2 | Device: iPad, iPhone | `48:56457` |
| Row with Swipe Actions | 6 | Type: Symbol and Label Tall, Symbol and Label, Symbol Only · Swipe: Right, Left | `550:49969` |
| Header | 3 | Type: Extra Prominent, Prominent, Nested | `517:38042` |

独立组件：Grouped Table Footer `35:55757`；Section Title `50:56535`

<details><summary>内部件 10 个（默认隐藏）</summary>

_Separator；_Edit Buttons/Light；_Images/Regular；_Images/Tall；_Trailing；_Header Trailing Accessories；_Swipe Actions/Symbol only；_Swipe Actions/Symbol and Label；_Swipe Actions/Symbol and Label Stacked；_Grabber

</details>

### 06-overlays 浮层

#### Action Sheets

SwiftUI：**原生**　`.confirmationDialog`

HIG：[action-sheets](https://developer.apple.com/design/human-interface-guidelines/action-sheets)　|　公开族 0 · 独立组件 1 · 变体 0 · 内部件 0

独立组件：Action Sheet `5446:10266`

#### Alerts

SwiftUI：**原生**　`.alert(_:isPresented:actions:message:)`

HIG：[alerts](https://developer.apple.com/design/human-interface-guidelines/alerts)　|　公开族 1 · 独立组件 1 · 变体 2 · 内部件 3

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Alert | 2 | Button Layout: Side-by-Side, Stacked | `63:57121` |

独立组件：Text Field `12616:942`

<details><summary>内部件 3 个（默认隐藏）</summary>

_Text Field Background；_Buttons；_Overlay - Alerts

</details>

#### Contextual Menus

SwiftUI：**原生**　`.contextMenu`

HIG：[context-menus](https://developer.apple.com/design/human-interface-guidelines/context-menus)　|　公开族 1 · 独立组件 1 · 变体 4 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Context Menu | 4 | Alignment: Horizontal (iPad only), Vertical · Side: Trailing, Leading | `125:58750` |

独立组件：Context Menu - Dimming Overlay `128:76929`

#### Menus

SwiftUI：**原生**　`Menu`

HIG：[menus](https://developer.apple.com/design/human-interface-guidelines/menus)　|　公开族 6 · 独立组件 2 · 变体 38 · 内部件 3

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Section Title | 2 | Mode: Dark, Light | `5855:4981` |
| Separator | 2 | Mode: Dark, Light | `5855:5763` |
| Menu Items | 12 | Mode: Dark, Light · State: Destructive, Disabled, Default · Menu has Selection: True, False | `5502:6049` |
| Menu Items - Submenus | 16 | Mode: Dark, Light · State: Disabled, Default · Open: True, False · Menu has Selection: True, False | `5848:33925` |
| Quick Action | 4 | Mode: Dark, Light · Destructive: True, False | `5498:16565` |
| Menu | 2 | Mode: Dark, Light | `5908:6487` |

独立组件：Text Selection `5711:35414`；Edit Menu `5713:47505`

<details><summary>内部件 3 个（默认隐藏）</summary>

_Selection；_Edit Menu Item；_Menu Indicator

</details>

#### Popovers

SwiftUI：**原生**　`.popover(isPresented:)`

HIG：[popovers](https://developer.apple.com/design/human-interface-guidelines/popovers)　|　公开族 1 · 独立组件 0 · 变体 12 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Popovers (iPad Only) | 12 | Edge: Bottom (Leading), Bottom (Center), Bottom (Trailing), Trailing (Bottom), Trailing (Top), Trailing (Middle) …+6 | `61:65421` |

#### Sheets

SwiftUI：**原生**　`.sheet(isPresented:)` + `.presentationDetents`

HIG：[sheets](https://developer.apple.com/design/human-interface-guidelines/sheets)　|　公开族 2 · 独立组件 2 · 变体 5 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Grabber | 2 | Mode: Light, Dark | `5827:57566` |
| Sheet - iPhone | 3 | Detent: Medium, Large, Large (Stacked) | `10525:1632` |

独立组件：Overlay `5551:18479`；Sheet - iPad `5719:30145`

### 07-system 系统

#### Product Bezels

SwiftUI：**不做**　设备外框，无对应 API

HIG：无对应 HIG 页　|　公开族 9 · 独立组件 1 · 变体 35 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| iPad Pro M4 13" | 2 | Color: Silver, Space Gray | `6316:14232` |
| iPad Pro M4 11" | 2 | Color: Silver, Space Gray | `6316:14229` |
| iPhone Duo | 8 | Display: Inner, Outer · Color: Night Sky, Star White · Orientation: Landscape, Portrait | `12887:20891` |
| iPhone 17 Pro | 3 | Color: Cosmic Orange, Deep Blue, Silver | `6316:14140` |
| iPhone 17 | 5 | Color: Black, Lavendar, Mist Blue, Sage, White | `6316:14198` |
| iPhone Air | 4 | Color: Cloud White, Light Gold, Sky Blue, Space Black | `6316:14172` |
| iPhone 17 Pro Max | 3 | Color: Cosmic Orange, Deep Blue, Silver | `6316:14155` |
| iPhone 18 Pro | 4 | Color: Black, Burgundy, Glacier, Silver | `12887:20847` |
| iPhone 18 Pro Max | 4 | Color: Black, Burgundy, Glacier, Silver | `12887:20854` |

独立组件：iPad mini `5456:18828`

#### System

SwiftUI：**自绘**　主屏幕、锁屏、控制中心、壁纸、Home Indicator 由系统绘制，只能用 SwiftUI 模拟外观

HIG：无对应 HIG 页　|　公开族 9 · 独立组件 8 · 变体 31 · 内部件 17

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Home Screen - iPad | 5 | Widgets: None, Small, Medium, Large, Extra Large | `595:43249` |
| Home Screen - iPhone Duo | 3 | Display: Inner Landscape, Inner Portrait, Outer Portrait · Widgets: None | `13138:22625` |
| Home Screen - iPhone | 5 | Widgets: None, Small, Medium, Large, XL | `561:5800` |
| Home Indicator | 4 | Device: iPhone, iPad · Orientation: Portrait, Landscape | `106:60033` |
| Wallpapers - iPhone | 2 | Mode: Light, Dark | `5707:9420` |
| Wallpapers - iPhone Duo | 6 | Style: Star White, Night Sky · Display: Outer Portrait, Inner Portrait, Inner Landscape | `13138:25373` |
| Wallpapers - iPad | 2 | Mode: Light, Dark | `5707:11471` |
| App Icon/iPhone | 2 | Custom Icon: True, False | `13148:36338` |
| App Icon/iPad | 2 | Custom Icon: True, False | `2402:17543` |

独立组件：Home Screen Quick Actions - iPad `2607:25388`；Home Screen Quick Actions - iPhone `2607:25374`；Control Center - iPad `2606:21776`；Control Center - iPhone `2524:24489`；Lock Screen - iPad `557:20781`；Lock Screen - iPhone `557:20840`；iPhone Duo/Outer Display Lens `12887:18298`；App Icon/iPhone/Home Indicator/_Badge `5592:39416`

<details><summary>内部件 17 个（默认隐藏）</summary>

_HSQA - App Icon - Light；_HSQA - Actions；_HSQA - Widget Row；_Controls - BG - iPad；_Controls - iPad - 2x2；_Controls - iPad - 2x1；_Controls - iPad - 1x1；_Controls - BG - iPhone；_Controls - iPhone - 2x2；_Controls - iPhone - 2x1；_Controls - iPhone - 1x1；_Launch Pad；_Dock Material；_App Icon/iPhone Duo；_Home Screen Quick Actions；_Controls - Lock Screen；_Dock - iPad

</details>

#### App Icons

SwiftUI：**自绘**　图标是资源文件，不是控件；用 `Image` 展示静态图或自绘

HIG：[app-icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)　|　公开族 0 · 独立组件 0 · 变体 0 · 内部件 3

<details><summary>内部件 3 个（默认隐藏）</summary>

_System Icons；_Custom Icon；_Icon Grid

</details>

#### Face ID

SwiftUI：**自绘**　认证界面由系统绘制（LocalAuthentication），只能自绘示意

HIG：无对应 HIG 页　|　公开族 1 · 独立组件 0 · 变体 2 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Face ID | 2 | State: Success, Authenticating | `123:58236` |

#### Notifications

SwiftUI：**自绘**　通知横幅由系统绘制，只能用 SwiftUI 模拟外观

HIG：[notifications](https://developer.apple.com/design/human-interface-guidelines/notifications)　|　公开族 2 · 独立组件 2 · 变体 5 · 内部件 1

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Notification - Collapsed | 3 | Stack: 3, 2, 1 | `135:67787` |
| Overlay | 2 | Mode: Dark, Light | `5551:17755` |

独立组件：Notification - Collapsed - List `135:73247`；Notification - Expanded `143:62847`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Time

</details>

#### Widgets

SwiftUI：**部分**　WidgetKit 需要独立的 Widget Extension；v1 在 App 内用 SwiftUI 视图模拟小组件外观

HIG：[widgets](https://developer.apple.com/design/human-interface-guidelines/widgets)　|　公开族 2 · 独立组件 21 · 变体 8 · 内部件 0

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Home Screen Widget - iPhone | 4 | Size: Small, Medium, Large, Extra Large | `143:214872` |
| Home Screen Widget - iPad | 4 | Size: Small, Medium, Large, Extra Large | `144:109471` |

独立组件：Lock Screen Widget / Circular / Open Gauge 2 `145:62670`；Lock Screen Widget / Circular / Closed Gauge `525:43689`；Lock Screen Widget / Circular / Open Gauge `145:62699`；Lock Screen Widget / Circular / Open Gauge 3 `525:43658`；Lock Screen Widget / Circular / Stack 3 Rows `145:62733`；Lock Screen Widget / Circular / Icon `525:43588`；Lock Screen Widget / Circular / Stack 2 Rows - Icon and Label `525:43609`；Lock Screen Widget / Circular / Stack 2 Rows - Labels `525:43610`；Lock Screen Widget - Inline `145:62745`；Lock Screen Widget - Rectangular with Chart `525:43083`；Lock Screen Widget - Modular with Bar `525:43071`；Lock Screen Widget - Rectangular Text Gauge `525:43106`；Lock Screen Widget - Tall Body with Icon `525:43115`；Lock Screen Widget - Tall Body `525:43122`；Lock Screen Widget - Modular Columns `525:43126`；Lock Screen Widget - Modular Table `525:43141`；Lock Screen Widget - Modular Standard `525:43148`；Lock Screen Widget - Modular List `525:43156`；Lock Screen Widget - Clock `525:43245`；Lock Screen Widget/2x2/Clock Big (iPad Only) `526:38737`；Lock Screen Widget/2x2/Date (iPad Only) `526:38824`

### 08-tokens 设计令牌

#### Colors

SwiftUI：**原生**　`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(uiColor:)`

HIG：[color](https://developer.apple.com/design/human-interface-guidelines/color)　|　公开族 0 · 独立组件 0 · 变体 0 · 内部件 3

<details><summary>内部件 3 个（默认隐藏）</summary>

_Swatch；_Swatch Grid；_Swatch - Light and Dark

</details>

#### Materials

SwiftUI：**原生**　`Material`、`.glassEffect(_:in:)`、`GlassEffectContainer`

HIG：[materials](https://developer.apple.com/design/human-interface-guidelines/materials)　|　公开族 5 · 独立组件 1 · 变体 18 · 内部件 2

| 族 | 变体 | 属性轴 | nodeId |
|---|---|---|---|
| Scroll Edge Effect - Soft | 2 | Edge: Bottom, Top | `5661:26943` |
| Scroll Edge Effect - Hard | 4 | Mode: Dark, Light · Edge: Bottom, Top | `5661:26978` |
| Liquid Glass - Regular - Large | 2 | Mode: Dark, Light | `5584:32504` |
| Liquid Glass - Regular - Medium | 2 | Mode: Light, Dark | `5584:32503` |
| Liquid Glass - Regular - Small | 8 | Mode: Dark, Light · Active: False, True · Prominent: False, True | `5584:32505` |

独立组件：Liquid Glass - Clear `5914:23547`

<details><summary>内部件 2 个（默认隐藏）</summary>

_Materials/Mode Options；_Materials

</details>

#### Layout Guides

SwiftUI：**原生**　示意用：`.safeAreaInset`、`.safeAreaBar`、`.safeAreaPadding`、`.containerRelativeFrame`

HIG：[layout](https://developer.apple.com/design/human-interface-guidelines/layout)　|　公开族 0 · 独立组件 12 · 变体 0 · 内部件 1

独立组件：iPhone Duo/Standard/Inner - Landscape - Folded `13035:902`；iPhone Duo/Sheets/Inner - Landscape - Folded `13035:1548`；iPhone Duo/Standard/Inner - Landscape `12892:62247`；iPhone Duo/Sheets/Inner - Landscape `12892:62243`；iPhone Duo/Standard/Inner - Portrait - Folded `13035:1050`；iPhone Duo/Sheets/Inner - Portrait - Folded `13035:1403`；iPhone Duo/Standard/Inner - Portrait `12892:62246`；iPhone Duo/Sheets/Inner - Portrait `12892:62242`；iPhone Duo/Standard/Outer - Landscape `12892:62245`；iPhone Duo/Sheets/Outer - Landscape `12892:62241`；iPhone Duo/Standard/Outer - Portrait `12892:62244`；iPhone Duo/Sheets/Outer - Portrait `12892:62240`

<details><summary>内部件 1 个（默认隐藏）</summary>

_Layout Overlays

</details>

### 09-assets 素材

#### _Kit Helpers

SwiftUI：**未登记**　用法示例板，非组件

HIG：无对应 HIG 页　|　公开族 0 · 独立组件 0 · 变体 0 · 内部件 2

<details><summary>内部件 2 个（默认隐藏）</summary>

_Mode Label；_Component Header

</details>


## 6. 附加：令牌页

这几页不来自 kit 画板，直接由 `Figma/reference/ios27/tokens/` 渲染，归入分类 `08-tokens`。kit 里同名的 `Colors`、`Materials` 画板页照常展示，二者并存。

- **颜色**（`tokens/colors.json`：colors 298，gradients 9）：纯色与渐变（hex / alpha / 使用次数）。SwiftUI：**原生**　按 hex 渲染色块，对照系统语义色
- **文字样式**（`tokens/typography.json`：styles 298）：字体、字重、字号、行高、字距。SwiftUI：**原生**　`Font`、`Font.TextStyle`，字体用系统 SF
- **效果与材质**（`tokens/effects.json`：effects 74）：模糊、阴影等，BACKGROUND_BLUR 即 Liquid Glass 材质层。SwiftUI：**原生**　`Material`、`.glassEffect`、`.shadow`、`.blur`
- **几何**（`tokens/geometry.json`：cornerRadii 47，itemSpacing 80，componentSizes 200）：圆角、间距、组件尺寸分布。SwiftUI：**原生**　纯数值展示：圆角、间距、尺寸

## 7. 本期不做

HIG 有页面，但 iOS 27 kit 没有对应设计稿，需要另行手绘，**v1 不做**。列表含 watchOS、visionOS、tvOS 专属页，以及另一个平台才有的页，可直接忽略：

[Charts](https://developer.apple.com/design/human-interface-guidelines/charts)、[Image views](https://developer.apple.com/design/human-interface-guidelines/image-views)、[Text views](https://developer.apple.com/design/human-interface-guidelines/text-views)、[Web views](https://developer.apple.com/design/human-interface-guidelines/web-views)、[Boxes](https://developer.apple.com/design/human-interface-guidelines/boxes)、[Collections](https://developer.apple.com/design/human-interface-guidelines/collections)、[Column views](https://developer.apple.com/design/human-interface-guidelines/column-views)、[Disclosure controls](https://developer.apple.com/design/human-interface-guidelines/disclosure-controls)、[Labels](https://developer.apple.com/design/human-interface-guidelines/labels)、[Lockups](https://developer.apple.com/design/human-interface-guidelines/lockups)、[Outline views](https://developer.apple.com/design/human-interface-guidelines/outline-views)、[Split views](https://developer.apple.com/design/human-interface-guidelines/split-views)、[Tab views](https://developer.apple.com/design/human-interface-guidelines/tab-views)、[Dock menus](https://developer.apple.com/design/human-interface-guidelines/dock-menus)、[Edit menus](https://developer.apple.com/design/human-interface-guidelines/edit-menus)、[Home Screen quick actions](https://developer.apple.com/design/human-interface-guidelines/home-screen-quick-actions)、[Ornaments](https://developer.apple.com/design/human-interface-guidelines/ornaments)、[Pull-down buttons](https://developer.apple.com/design/human-interface-guidelines/pull-down-buttons)、[The menu bar](https://developer.apple.com/design/human-interface-guidelines/the-menu-bar)、[Path controls](https://developer.apple.com/design/human-interface-guidelines/path-controls)、[Search fields](https://developer.apple.com/design/human-interface-guidelines/search-fields)、[Token fields](https://developer.apple.com/design/human-interface-guidelines/token-fields)、[Panels](https://developer.apple.com/design/human-interface-guidelines/panels)、[Scroll views](https://developer.apple.com/design/human-interface-guidelines/scroll-views)、[Combo boxes](https://developer.apple.com/design/human-interface-guidelines/combo-boxes)、[Digit entry views](https://developer.apple.com/design/human-interface-guidelines/digit-entry-views)、[Image wells](https://developer.apple.com/design/human-interface-guidelines/image-wells)、[Activity rings](https://developer.apple.com/design/human-interface-guidelines/activity-rings)、[Gauges](https://developer.apple.com/design/human-interface-guidelines/gauges)、[Rating indicators](https://developer.apple.com/design/human-interface-guidelines/rating-indicators)、[App Shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts)、[Complications](https://developer.apple.com/design/human-interface-guidelines/complications)、[Controls](https://developer.apple.com/design/human-interface-guidelines/controls)、[Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities)、[Snippets](https://developer.apple.com/design/human-interface-guidelines/snippets)、[Top Shelf](https://developer.apple.com/design/human-interface-guidelines/top-shelf)、[Watch faces](https://developer.apple.com/design/human-interface-guidelines/watch-faces)

## 8. 开发步骤与验收（网页版，已完成）

| 步骤 | 内容 | 验收 |
|---|---|---|
| D1 数据 | 写汇总脚本，生成精简 JSON | 页面数 41、公开族 106、独立组件 94、变体 634 与第 1 节完全一致 |
| D2 外壳 | 浮窗按钮、`⌘K` 面板、搜索、`←` `→`、hash 路由、明暗开关 | 第 5 节每个页面都能从面板到达；刷新后位置不丢 |
| D3 页面 | 按第 3 节渲染所有页面（占位图） | 逐页打开无报错；变体最多的族滚动流畅 |
| D4 规格面板 | 点击变体显示只读规格 | 任选 5 个变体，数值与 `specs/*.json` 一致 |
| D5 SVG | 接入 `svg/`，自动替换占位 | 导出后 Buttons 页显示真实图，其余页不受影响 |

## 9. 已决定

1. 加全局「设备」筛选（全部 / iPhone / iPad / iPhone Duo），默认 iPhone。
2. 整屏类页面（`System`、`Widgets`、`Keyboards` 等）用 fit-to-width 缩放展示。
3. 内部件不参与全局搜索，只在页面底部手动展开。
