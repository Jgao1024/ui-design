# macOS 27 原生实现登记表

> 骨架由 `tools/gen-docs.py` 首次生成，之后由开发 agent 维护，**脚本不再覆盖**。
> 需求见 [native-macos-app.md](../../docs/native-macos-app.md)，组件清单见 [macos-components.md](../../docs/macos-components.md)。
> 状态只用五个值：`未开始`、`已实现`、`部分实现`、`无法实现`、`内部件`。每实现一个族就立即更新它的行；`无法实现` 必须写原因。

### Sidebars

分类 `01-navigation`　SwiftUI 对应：**原生**　`NavigationSplitView`、`List` + `.listStyle(.sidebar)`、`.inspector`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Item | `655:2306` | 90 | 部分实现 | `List(selection:)` + `.listStyle(.sidebar)` + 嵌套 `DisclosureGroup`（Level 0–4）+ `.environment(\.sidebarRowSize, .large/.medium/.small)` + `.disabled(true)` | Pages/Sidebars/SidebarItemDemo.swift、SidebarLevelsList.swift | 侧边栏材质背景只在 `NavigationSplitView` 侧边栏列出现，页内是普通背景（完整外观见示例窗口）；Active: False 用 `controlActiveState = .inactive` 模拟，可能无效 |
| 族 | Section Header | `195:8503` | 24 | 已实现 | `List` + `Section("…")` + `.listStyle(.sidebar)` + `sidebarRowSize`；第一个 Section 即 First Section: True | Pages/Sidebars/SectionHeaderDemo.swift、SidebarSectionsList.swift | Active: False 用环境值模拟，可能无效 |
| 族 | Sidebars - Composed | `656:3559` | 3 | 已实现 | 同 Section Header 的侧边栏列表，三种 `sidebarRowSize`；整窗见示例窗口 `NavigationSplitView` | Pages/Sidebars/SidebarsComposedDemo.swift |  |
| 族 | Window Controls | `4358:9901` | 2 | 已实现 | 窗口自带红绿灯和侧边栏按钮：`openWindow` 打开 `.windowToolbarStyle(.unified)` / `.unifiedCompact` 示例窗口 | Pages/Sidebars/SidebarWindowControlsDemo.swift | 属于窗口本身，不能放进页面内 |
| 族 | BG | `4362:1751` | 2 | 部分实现 | `NavigationSplitView` 侧边栏列（示例窗口）；前台 / 后台窗口对比 Active | Pages/Sidebars/SidebarBackgroundDemo.swift | 侧边栏材质由分栏视图绘制，页内无法单独渲染 |
| 内部件·族 | _Disclosure - Header | `656:2231` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Disclosure - Folder | `121:11475` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Detail | `4356:15072` | 24 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Selection | `4356:15307` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Leading | `4358:1920` | 96 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Windows

分类 `01-navigation`　SwiftUI 对应：**原生**　`WindowGroup`、`Window`、`.windowToolbarStyle`、`NavigationSplitView`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Window BG | `683:16442` | 4 | 已实现 | `RoundedRectangle().fill(.windowBackground)` | Pages/Windows/WindowBackgroundDemo.swift | Active: False 用环境值模拟，可能无效 |
| 族 | Window Controls/Standard | `488:17656` | 4 | 已实现 | `WindowGroup` 窗口自带的红绿灯（本窗口和示例窗口） | Pages/Windows/WindowsPage.swift、WindowPartDemo.swift | 属于窗口本身；切到别的 App 即 Active: False |
| 族 | Window Controls/Utility | `488:17661` | 4 | 已实现 | `UtilityWindow` 自带的小号红绿灯 | Pages/Windows/UtilityPanelContent.swift、OpenUtilityPanelButton.swift | 点别的窗口即 Active: False |
| 族 | Window Titles/Window | `4358:16748` | 4 | 已实现 | `.navigationTitle` + `NavigationSplitView(columnVisibility:)` 有 / 无侧边栏 | Pages/Windows/DemoWindowContent.swift |  |
| 族 | Windows - Composed | `4363:18459` | 48 | 部分实现 | 4 个 `WindowGroup(for: WindowDemoConfig.self)` 各配 `.windowToolbarStyle(.automatic/.unified/.unifiedCompact/.expanded)`；无标题用 `.toolbar(removing: .title)`；无侧边栏用 `columnVisibility = .detailOnly` + `.toolbar(removing: .sidebarToggle)` | Pages/Windows/WindowsComposedDemo.swift、DemoWindowContent.swift、DemoToolbarContent.swift、App/ComponentGalleryMacApp.swift | 12 种 Window Type 都能打开真实窗口；Default 系列的 `.automatic` 遇到分栏视图时由系统选样式，可能与 Unified 相同；Active 用前后台窗口对比 |
| 族 | Utility Panel | `4374:54811` | 2 | 已实现 | `UtilityWindow("检查器", id:)` | Pages/Windows/UtilityPanelContent.swift |  |
| 独立 | Window Titles/Utility Panel | `650:5930` | — | 已实现 | `UtilityWindow` 的标题栏 | Pages/Windows/UtilityPanelContent.swift |  |

### Menu Bar and Dock

分类 `02-bars`　SwiftUI 对应：**部分**　菜单栏用 `MenuBarExtra`、`.commands`、`CommandMenu`；Dock 与桌面壁纸无 API，只能自绘

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Desktop Wallpaper | `121:13310` | 2 | 部分实现 | 自绘：`LinearGradient` 模拟壁纸 + `FitWidth` 缩放 | Pages/MenuBarAndDock/DesktopWallpaperDemo.swift、Shared/WallpaperBackdrop.swift | 桌面壁纸是图片资源，App 没有 API 渲染系统壁纸 |
| 族 | Menu Bar | `121:13196` | 2 | 部分实现 | 真实：`CommandMenu`「示例菜单」+ `MenuBarExtra(isInserted:)`（页内开关）；页内 Over Dark / Over Light 为自绘模拟 | Pages/MenuBarAndDock/MenuBarDemo.swift、MenuBarMock.swift、App/GalleryCommands.swift、App/MenuBarExtraContent.swift | 菜单栏由系统绘制，App 只能往里加菜单和状态栏图标 |
| 族 | Desktop Template | `121:13243` | 2 | 部分实现 | 自绘：壁纸 + 菜单栏 + Dock，按 1512×993 排版后 `FitWidth` 缩放 | Pages/MenuBarAndDock/DesktopTemplateDemo.swift | 整屏模板没有对应控件 |
| 族 | Dock | `4355:8233` | 2 | 部分实现 | 自绘：`.glassEffect` 底 + `NSWorkspace.shared.icon(forFile:)` 真实 App 图标 | Pages/MenuBarAndDock/DockDemo.swift、DockMock.swift | Dock 由系统进程绘制，无 API。AppKit 用途：`NSWorkspace` 取 App 图标，本页级别为「部分」，允许 |
| 族 | Dock Icon | `4355:8583` | 2 | 部分实现 | 自绘：`NSWorkspace` 图标 + 运行指示点 | Pages/MenuBarAndDock/DockIconDemo.swift、DockIcon.swift | 同 Dock |
| 内部件·族 | _Menu Bar/Menu Item / Dark | `164:9698` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Menu Bar/Menu Item / Light | `121:13187` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Menu Bar/App Name / Dark | `164:9683` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Menu Bar/App Name / Light | `121:13178` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Menu Bar/Apple Menu/Light | `121:13169` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Menu Bar/Apple Menu/Dark | `552:10839` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _System App Icon | `495:3662` | 96 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Toolbars

分类 `02-bars`　SwiftUI 对应：**原生**　`.toolbar`、`ToolbarItem`、`ToolbarItemGroup`、`.windowToolbarStyle`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Segmented Control | `121:11848` | 8 | 部分实现 | 真实：示例窗口 `ToolbarItem(placement: .principal) { Picker(.segmented) }`；页内 `Picker(.segmented)` + `.controlSize(.regular/.extraLarge)` | Pages/Toolbars/ToolbarSegmentedDemo.swift、Windows/DemoToolbarContent.swift | 页内没有工具栏玻璃底座，真实外观看示例窗口；Active: False 环境模拟 |
| 族 | Button Group | `647:1886` | 8 | 部分实现 | `ControlGroup`（示例窗口 `.navigation` 位置）+ `.controlSize` | Pages/Toolbars/ToolbarButtonGroupDemo.swift | 同上 |
| 族 | Button | `648:4796` | 16 | 部分实现 | `ToolbarItemGroup(placement: .primaryAction)` 里的 `Button`；页内 `Button` + `.buttonStyle(.glass)` + `.labelStyle(.iconOnly)` | Pages/Toolbars/ToolbarButtonDemo.swift | 同上 |
| 族 | Search | `177:10807` | 48 | 部分实现 | 真实：示例窗口 `.searchable(text:prompt:)`；页内放大镜 + 无边框 `TextField` + 清除按钮 | Pages/Toolbars/ToolbarSearchDemo.swift、SearchFields/SearchFieldImitation.swift | 页内胶囊底色是自绘；State: Focused、Typing 只在示例窗口里能看到 |
| 族 | Pull Down Button | `641:1584` | 16 | 部分实现 | `Menu(_:systemImage:)` + `.buttonStyle(.glass)` | Pages/Toolbars/ToolbarPullDownDemo.swift、ToolbarActionsMenu.swift | 同 Segmented Control |
| 族 | Pop-Up Button | `641:1685` | 16 | 部分实现 | `Picker` + `.pickerStyle(.menu)` | Pages/Toolbars/ToolbarPopUpDemo.swift | 同 Segmented Control |
| 独立 | Utility Panel Tab Bar | `204:9979` | — | 部分实现 | `Picker(.segmented)` + `.labelStyle(.iconOnly)`（也在 `UtilityWindow` 顶部） | Pages/Toolbars/UtilityPanelTabBarDemo.swift、Windows/UtilityPanelContent.swift | SwiftUI 没有面板标签栏控件，用图标分段控件近似 |
| 内部件·族 | _Buttons/XL | `598:13336` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Buttons/Medium | `641:1751` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Separator | `4358:14691` | 8 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Button - Utility Panel Tab Bar | `4358:16952` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Buttons

分类 `03-controls`　SwiftUI 对应：**原生**　`Button` + `.buttonStyle(.automatic/.bordered/.borderedProminent/.borderless/.plain/.glass/.glassProminent)`、`.controlSize`、`.buttonBorderShape`、`.tint`、`Button(role: .destructive)`、`.disabled`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Arrow Buttons | `483:5553` | 3 | 已实现 | `Button(_:systemImage:)` + `.buttonStyle(.bordered)` + `.buttonBorderShape(.circle)` + `.labelStyle(.iconOnly)` | Pages/Buttons/ArrowButtonsDemo.swift、ArrowButton.swift | State: Clicked 交互态，需手动按住 |
| 族 | Buttons | `121:11923` | 72 | 已实现 | `.buttonStyle(.bordered/.borderedProminent/.borderless)`、`Button(role: .destructive)`、`.tint(.accentColor)`、`.disabled`；Over-Glass 放在 `.glassEffect` 上 | Pages/Buttons/ButtonsDemo.swift、ButtonsGrid.swift、SampleButton.swift、ButtonSample.swift | State: Clicked 交互态；Active: False 环境模拟，可能无效 |
| 族 | Buttons - Toggle | `4341:8462` | 24 | 已实现 | `Toggle` + `.toggleStyle(.button)` | Pages/Buttons/ToggleButtonsDemo.swift、ToggleButtonsGrid.swift | State: Clicked 交互态；Active: False 环境模拟 |
| 内部件·族 | _Labels - Toggle | `4341:7322` | 48 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Labels - Borderless | `4341:7055` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Labels - Preferred | `4341:7625` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Labels - Destructive | `4341:7910` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Labels - Tinted | `4341:8195` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Label | `4339:4284` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Color Wells

分类 `03-controls`　SwiftUI 对应：**原生**　`ColorPicker`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Color Picker - Wheel | `121:12520` | 2 | 部分实现 | `ColorPicker(_:selection:)` + `.labelsHidden()` | Pages/ColorWells/ColorPickerWheelDemo.swift | ColorPicker 只有一种系统外观，不能单独指定为色轮按钮；Color Selected: False 用透明色近似 |
| 族 | Color Picker | `4335:11825` | 3 | 已实现 | `ColorPicker` + `.disabled` | Pages/ColorWells/ColorPickerDemo.swift | State: Selected 只在颜色面板打开时出现，交互态 |

### Combo Boxes

分类 `03-controls`　SwiftUI 对应：**桥接**　SwiftUI 无组合框，用 `NSComboBox`（`NSViewRepresentable`）

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Combo Box | `121:11951` | 4 | 已实现 | 桥接：`NSComboBox`（`NSViewRepresentable` + `NSComboBoxDelegate` 协调器） | Pages/ComboBoxes/ComboBoxView.swift、ComboBoxDemo.swift | AppKit 原因：SwiftUI 没有组合框。Field Clicked、Button Clicked 为交互态 |

### Disclosure Controls

分类 `03-controls`　SwiftUI 对应：**原生**　`DisclosureGroup`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Disclosure Button | `121:12049` | 6 | 部分实现 | `DisclosureGroup(_:isExpanded:)` + `.disabled` | Pages/DisclosureControls/DisclosureButtonDemo.swift | Figma 是带圆角底座的上下箭头按钮，DisclosureGroup 在 macOS 上画三角箭头，无公开 API 切换；Clicked 交互态 |

### Group Boxes

分类 `03-controls`　SwiftUI 对应：**原生**　`GroupBox`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Group Box | `121:11265` | — | 已实现 | `GroupBox(_:content:)` | Pages/GroupBoxes/GroupBoxDemo.swift |  |

### Image Wells

分类 `03-controls`　SwiftUI 对应：**桥接**　可编辑图片框用 `NSImageView`（`NSViewRepresentable`），拖放用 `.dropDestination`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Image Well | `121:12528` | 2 | 已实现 | 桥接：`NSImageView`（`isEditable = true`、`imageFrameStyle = .grayBezel`） | Pages/ImageWells/ImageWellView.swift、ImageWellDemo.swift | AppKit 原因：SwiftUI 没有可编辑图片框；可拖入图片 |

### Pop-up and Pull-down Buttons

分类 `03-controls`　SwiftUI 对应：**原生**　`Picker` + `.pickerStyle(.menu)`、`Menu`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Pop-Up Button | `121:11978` | 6 | 已实现 | `Picker` + `.pickerStyle(.menu)`；Show Label: False 用 `.labelsHidden()` | Pages/PopUpAndPullDownButtons/PopUpButtonDemo.swift、SizePicker.swift | State: Clicked 交互态 |
| 族 | Pulldown Button | `202:2935` | 3 | 已实现 | `Menu(_:content:)` | Pages/PopUpAndPullDownButtons/PulldownButtonDemo.swift、ActionsMenu.swift | State: Clicked 交互态 |

### Progress Indicators

分类 `03-controls`　SwiftUI 对应：**原生**　`ProgressView`（线性、圆形、不确定）、`Gauge`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Circular - Indeterminate ("Spinner") | `4349:11606` | 2 | 已实现 | `ProgressView()` + `.controlSize(.small/.large)` | Pages/ProgressIndicators/SpinnerDemo.swift |  |
| 族 | Circular - Determinate | `4349:10450` | 20 | 已实现 | `ProgressView(value:)` + `.progressViewStyle(.circular)` + `.controlSize` | Pages/ProgressIndicators/CircularDeterminateDemo.swift | Active: False 环境模拟，可能无效 |
| 族 | Linear - Indeterminate | `488:144` | 4 | 已实现 | `ProgressView()` + `.progressViewStyle(.linear)` + `.controlSize(.small)` | Pages/ProgressIndicators/LinearIndeterminateDemo.swift | Active: False 环境模拟 |
| 族 | Linear - Determinate | `121:12208` | 20 | 已实现 | `ProgressView(value:)` + `.progressViewStyle(.linear)` | Pages/ProgressIndicators/LinearDeterminateDemo.swift | Active: False 环境模拟 |

### Scrollbar

分类 `03-controls`　SwiftUI 对应：**原生**　`ScrollView`、`.scrollIndicators`；滚动条样式跟随系统设置，不能强制

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Scrollbar - Vertical | `497:6481` | 9 | 部分实现 | `ScrollView(.vertical)`，内容 2/4/8 倍高，`.defaultScrollAnchor(.top/.center/.bottom)` + `.scrollIndicators(.visible)` | Pages/Scrollbar/ScrollbarVerticalDemo.swift、ScrollbarSample.swift | 滚动条是否常显由「系统设置 › 外观 › 显示滚动条」决定，App 不能强制 |
| 族 | Scrollbar - Horizontal | `497:6567` | 9 | 部分实现 | `ScrollView(.horizontal)` + `.defaultScrollAnchor(.leading/.center/.trailing)` | Pages/Scrollbar/ScrollbarHorizontalDemo.swift | 同上 |

### Segmented Controls

分类 `03-controls`　SwiftUI 对应：**原生**　`Picker` + `.pickerStyle(.segmented)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Segmented Control | `121:12394` | 4 | 已实现 | Selectable: True 用 `Picker` + `.pickerStyle(.segmented)`；False 用 `ControlGroup`（瞬时按钮组） | Pages/SegmentedControls/SegmentedControlDemo.swift | Active: False 环境模拟 |
| 内部件·族 | _Separator | `4346:9185` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Segment - Not selectable | `4346:9772` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Segment - Selectable | `498:4493` | 12 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Sliders and Dials

分类 `03-controls`　SwiftUI 对应：**部分**　滑块用 `Slider`、`Gauge`；旋钮（Dial）用 `NSSlider` 圆形样式桥接

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Slider | `121:12408` | 60 | 已实现 | `Slider(value:in:neutralValue:label:ticks:)`，Ticks 用 `SliderTickContentForEach` + `SliderTick` | Pages/SlidersAndDials/SliderDemo.swift、SliderGrid.swift、SliderSample.swift | State: Clicked 交互态；Active: False 环境模拟 |
| 族 | Slider - Center-biased | `533:3289` | 60 | 已实现 | 同 Slider，`neutralValue: 0.5` 从中点填充 | Pages/SlidersAndDials/SliderSample.swift | 同上 |
| 族 | Dial (Circular Slider) | `121:12063` | 6 | 已实现 | 桥接：`NSSlider`（`sliderType = .circular`） | Pages/SlidersAndDials/DialView.swift、DialDemo.swift、DialRow.swift | AppKit 原因：SwiftUI 没有圆形滑块，本页级别为「部分」；Clicked 交互态 |
| 内部件·族 | _Track Filled | `512:2962` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Track Filled | `532:19504` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Track Unfilled | `512:3070` | 3 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Track Unfilled - Center-biased | `533:7638` | 3 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Knob | `510:9967` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Slider Midline | `4352:16468` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Knob - Clicked - Ticked | `4350:10342` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Knob - Clicked - Non-Ticked | `4352:10356` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Steppers

分类 `03-controls`　SwiftUI 对应：**原生**　`Stepper`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Stepper/No Field | `121:12079` | 4 | 已实现 | `Stepper(_:value:in:)` + `.labelsHidden()` | Pages/Steppers/StepperDemo.swift、StepperSample.swift | Clicked - Up / Down 交互态 |
| 族 | Stepper/Inside Field | `540:1629` | 4 | 部分实现 | 无边框 `TextField(value:format:)` + `Stepper(.small)`，外框自绘 | Pages/Steppers/StepperSample.swift | SwiftUI 没有嵌入式步进器样式，外框是自绘边框；Clicked 交互态 |
| 族 | Stepper/Outside Field | `540:4659` | 4 | 已实现 | `TextField(value:format: .number)` + `Stepper` | Pages/Steppers/StepperSample.swift | Clicked 交互态 |

### Toggles

分类 `03-controls`　SwiftUI 对应：**原生**　`Toggle` + `.toggleStyle(.switch/.checkbox/.button)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Toggles - Switches | `121:12161` | 12 | 已实现 | `Toggle` + `.toggleStyle(.switch)` | Pages/Toggles/SwitchesDemo.swift、SwitchesGrid.swift | Clicked 交互态；Figma 拼写 Disabeld 按 Disabled 处理；Active: False 环境模拟 |
| 族 | Toggles - Radio Buttons | `121:12141` | 18 | 部分实现 | `Picker` + `.pickerStyle(.radioGroup)` | Pages/Toggles/RadioButtonsDemo.swift、RadioButtonsGrid.swift、RadioPair.swift | Selection: Mixed（6 个变体）无法复现：SwiftUI 单选组没有混合态；Clicked 交互态 |
| 族 | Toggles - Checkboxes | `497:3757` | 18 | 已实现 | `Toggle` + `.toggleStyle(.checkbox)`；Mixed 用 `Toggle(_:sources:isOn:)` | Pages/Toggles/CheckboxesDemo.swift、CheckboxesGrid.swift | Clicked 交互态 |
| 内部件·族 | _Knob | `475:191` | 30 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Glyphs - Radio Buttons | `4348:8163` | 16 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Glyphs - Checkboxes | `4348:8164` | 16 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Knob Clicked | `4348:11417` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Forms

分类 `04-input`　SwiftUI 对应：**原生**　`Form`、`.formStyle(.grouped)`、`.formStyle(.columns)`、`LabeledContent`、`Section`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Trailing Accessories | `121:12986` | 12 | 部分实现 | `Form` + `.formStyle(.grouped)`：`TextField`、`Toggle(.switch)`、`Stepper`、`Picker(.radioGroup)`、`Picker`、`Menu`、`LabeledContent`、`Toggle(.checkbox)`、`Button` | Pages/Forms/TrailingAccessoriesDemo.swift | Type: Combo Box 未复现：Forms 为「原生」页，不允许 AppKit 桥接（真实组合框见 Combo Boxes 页） |
| 族 | Leading Accessories | `121:12901` | 8 | 已实现 | `Form(.grouped)`：`Picker(.radioGroup)`、`Label`、`DisclosureGroup`、`Toggle(.checkbox)`、标题副标题、`Button` | Pages/Forms/LeadingAccessoriesDemo.swift、TitleSubtitle.swift |  |
| 独立 | Form | `4356:9283` | — | 已实现 | `Form` + `Section` + `.formStyle(.grouped)` + `LabeledContent` | Pages/Forms/FormDemo.swift |  |
| 独立 | Form Row | `4356:9291` | — | 已实现 | `LabeledContent { } label: { Label { } icon: { } }` | Pages/Forms/FormRowDemo.swift |  |
| 内部件·族 | _Left Accessory Icons / 32pt | `121:12864` | 16 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Left Accessory Icons / 24pt | `121:12827` | 16 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Chevron | `243:3698` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Search Fields

分类 `04-input`　SwiftUI 对应：**原生**　`.searchable`、`TextField`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Search Field | `480:760` | 6 | 部分实现 | 真实：示例窗口 `.searchable`；页内放大镜 + `TextField(.plain)` + 清除按钮 + `@FocusState` | Pages/SearchFields/SearchFieldDemo.swift、SearchFieldImitation.swift | macOS 搜索框只能由 `.searchable` 放进工具栏或侧边栏，页内胶囊是自绘；Focused 改为点「聚焦」按钮触发，避免抢走 ← → 翻页焦点 |
| 内部件·族 | _Clear | `480:1042` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Magnifying Glass | `480:1029` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Text Fields

分类 `04-input`　SwiftUI 对应：**原生**　`TextField`、`SecureField`、`TextEditor`、`.textFieldStyle`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Text Field | `121:12220` | 6 | 已实现 | `TextField` + `.textFieldStyle(.roundedBorder)` + `.disabled` + `@FocusState` | Pages/TextFields/TextFieldDemo.swift | Focused 改为点「聚焦」按钮触发，避免抢走 ← → 翻页焦点 |
| 内部件·族 | _Input Fields | `479:5336` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Lists and Tables

分类 `05-collections`　SwiftUI 对应：**原生**　`List`、`Table`、`.listStyle`、`.alternatingRowBackgrounds()`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Sort Order Indicator | `4356:13719` | 2 | 已实现 | `Table(_:sortOrder:)` + `KeyPathComparator`（`.forward` / `.reverse`） | Pages/ListsAndTables/SortOrderIndicatorDemo.swift、SortableTable.swift |  |
| 族 | Table Rows | `4356:11854` | 20 | 已实现 | `Table(of:selection:) { } rows: { DisclosureTableRow … }` 展开到 Level 4 + `.alternatingRowBackgrounds()` | Pages/ListsAndTables/TableRowsDemo.swift、OutlineTable.swift | Selected + Active / Inactive 取决于表格焦点和窗口激活；Inactive 用环境值模拟，点别处让表格失焦也能看到 |
| 族 | Table Rows - Blank | `4356:12135` | 2 | 已实现 | 空数据 `Table` + `.alternatingRowBackgrounds(.enabled/.disabled)` | Pages/ListsAndTables/TableRowsBlankDemo.swift |  |
| 独立 | Group Title | `0:2566` | — | 已实现 | `List` + `Section("Group Title")` + `.listStyle(.inset)` | Pages/ListsAndTables/GroupTitleDemo.swift |  |
| 独立 | Column Header | `4356:13469` | — | 已实现 | `Table` 列标题栏（带排序指示器） | Pages/ListsAndTables/ColumnHeaderDemo.swift |  |
| 独立 | Outline View | `4356:13263` | — | 已实现 | `Table(_:children:selection:)` | Pages/ListsAndTables/OutlineViewDemo.swift、FileRow.swift |  |
| 内部件·族 | _Column Headers | `121:12610` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Disclosure - Selected | `4356:9904` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Disclosure - Unselected | `4356:9922` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _BG | `4356:10151` | 3 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·族 | _Icon | `4356:10687` | 3 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Alerts

分类 `06-overlays`　SwiftUI 对应：**原生**　`.alert(_:isPresented:actions:message:)`、`.confirmationDialog`（真实弹出，非内联）

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Alert | `121:11186` | 2 | 已实现 | `.alert(_:isPresented:actions:message:)`：2 个按钮左右排列，3 个按钮上下堆叠 | Pages/Alerts/AlertDemo.swift | 真实弹出，不能内联；排列方式由系统按按钮数量决定 |
| 独立 | Overlay | `4335:347` | — | 已实现 | 由系统在呈现 `.alert` 时绘制 | Pages/Shared/SystemOverlayNote.swift | 不能单独渲染，弹出提醒时可见 |
| 内部件·族 | _Buttons | `121:11170` | 6 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Dialogs

分类 `06-overlays`　SwiftUI 对应：**原生**　`.fileImporter`、`.fileExporter`、`.confirmationDialog`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Overlay | `682:4331` | — | 已实现 | 由系统在呈现对话框时绘制 | Pages/Shared/SystemOverlayNote.swift | 不能单独渲染 |
| 独立 | Large | `174:9424` | — | 部分实现 | `.fileExporter(isPresented:document:contentType:defaultFilename:onCompletion:)` | Pages/Dialogs/SaveDialogDemo.swift、SampleTextDocument.swift | 存储对话框的展开态由用户点箭头切换，App 不能指定 |
| 独立 | Small | `171:9049` | — | 部分实现 | 同 Large | Pages/Dialogs/SaveDialogDemo.swift | 收起态由用户切换，App 不能指定 |

### Menus

分类 `06-overlays`　SwiftUI 对应：**原生**　`Menu`、`.contextMenu`、`CommandMenu`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Menu Background | `4353:2293` | 2 | 已实现 | `Menu` 打开的系统菜单背景 | Pages/Menus/MenuPartDemo.swift、SampleMenuButton.swift | 只在打开的菜单里可见 |
| 族 | Headers | `4353:3147` | 4 | 已实现 | 菜单里的 `Section("Header")` 标题 | Pages/Menus/SampleMenuItems.swift | Inset 由系统根据菜单里是否有勾选项决定 |
| 族 | Separators | `4353:3151` | 2 | 已实现 | 菜单里的 `Divider()` | Pages/Menus/SampleMenuItems.swift |  |
| 族 | Menu Items | `121:12600` | 32 | 已实现 | `Button` + `.keyboardShortcut`、`.disabled`、`Toggle`、`Picker(.inline)`（勾选）、嵌套 `Menu`（Submenu） | Pages/Menus/SampleMenuItems.swift | State: Hover、Hover + Key 交互态，只能在打开的菜单里悬停查看 |
| 独立 | Menu | `483:8811` | — | 已实现 | `Menu`、`.contextMenu`、菜单栏 `CommandMenu` | Pages/Menus/FullMenuDemo.swift、App/GalleryCommands.swift |  |
| 内部件·族 | _Shortcuts | `483:7601` | 4 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Popovers

分类 `06-overlays`　SwiftUI 对应：**原生**　`.popover(isPresented:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Popover | `121:11291` | 24 | 部分实现 | `.popover(isPresented:attachmentAnchor: .point(_:), arrowEdge:)`，12 个按钮 | Pages/Popovers/PopoverDemo.swift、PopoverButton.swift、PopoverPlacement.swift | 括号里的位置（箭头在气泡边上的位置）由系统按空间决定，8 个变体只能近似 |
| 独立 | Popover | `4336:13199` | — | 已实现 | `.popover(isPresented:)` | Pages/Popovers/PopoverButton.swift |  |

### Sheets

分类 `06-overlays`　SwiftUI 对应：**原生**　`.sheet(isPresented:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Sheet | `4358:15435` | 2 | 已实现 | `.sheet(isPresented:)` + `@Environment(\.dismiss)` | Pages/Sheets/SheetDemo.swift、SheetContent.swift |  |

### Tooltips

分类 `06-overlays`　SwiftUI 对应：**原生**　`.help(_:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Tooltip | `0:2793` | — | 已实现 | `.help(_:)` | Pages/Tooltips/TooltipDemo.swift | 悬停约 1 秒后由系统显示 |
| 内部件·族 | _Text | `4331:12215` | 2 | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Product Bezels

分类 `07-system`　SwiftUI 对应：**不做**　设备外框，无对应 API

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | MacBook Pro PROLED XDR Display | `4490:22142` | 4 | 无法实现 | — | Pages/ProductBezels/ProductBezelsPage.swift | 设备外框不是控件，也没有对应 API（登记表级别：不做）；页面显示原因卡 |

### Notifications

分类 `07-system`　SwiftUI 对应：**自绘**　通知横幅由系统绘制（`UNUserNotificationCenter`），只能用 SwiftUI 模拟外观

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Notification | `4358:11429` | 4 | 部分实现 | 自绘：`HStack` 图标 + 文字 + `.glassEffect(.regular, in: .rect(cornerRadius: 18))`，Stack 用 `ZStack` 叠放 | Pages/Notifications/NotificationDemo.swift、NotificationBanner.swift | 通知横幅由系统绘制（UNUserNotificationCenter），App 内只能模拟外观 |
| 独立 | Liquid Glass - Notification - Dark | `4358:11539` | — | 部分实现 | 自绘：`.glassEffect` + `.environment(\.colorScheme, .dark)` | Pages/Notifications/GlassNotificationDemo.swift | 同 Notification |
| 独立 | Liquid Glass - Notification - Light | `4358:11549` | — | 部分实现 | 自绘：`.glassEffect` + `.environment(\.colorScheme, .light)` | Pages/Notifications/GlassNotificationDemo.swift | 同 Notification |

### Pointers

分类 `07-system`　SwiftUI 对应：**原生**　`.pointerStyle(_:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Pointers | `2302:7096` | 21 | 部分实现 | `.pointerStyle(_:)`：`.default`、`.horizontalText`、`.link`、`.grabIdle/.grabActive`、`.rectSelection`、`.zoomIn/.zoomOut`、`.columnResize/.rowResize(directions:)`、`.frameResize(position:)` | Pages/Pointers/PointersDemo.swift、PointerTile.swift、PointerSample.swift | Move、Beachball、Default with Menu Badge 三种没有公开 API |

### Colors

分类 `08-tokens`　SwiftUI 对应：**原生**　`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(nsColor:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 内部件·独立 | _Swatch - Light and Dark | `484:9569` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Swatch - Light and Dark (Vibrant) | `485:9762` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Swatch - Text - Light and Dark (Vibrant) | `486:10091` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |
| 内部件·独立 | _Swatch - Text - Light and Dark (Vibrant) | `486:10153` | — | 内部件 | — | Pages/Shared/InternalsSection.swift | 只在页面底部折叠区列名字，不做演示 |

### Materials

分类 `08-tokens`　SwiftUI 对应：**原生**　`Material`（`.ultraThinMaterial` 到 `.thickMaterial`、`.bar`）、`.glassEffect(_:in:)`、`GlassEffectContainer`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Scroll Edge Effect - Hard | `4363:18594` | 4 | 已实现 | `.scrollEdgeEffectStyle(.hard, for:)` + `.safeAreaBar(edge:)` | Pages/Materials/ScrollEdgeEffectDemo.swift、ScrollEdgeSample.swift |  |
| 族 | Scroll Edge Effect - Soft | `4363:18554` | 2 | 已实现 | `.scrollEdgeEffectStyle(.soft, for:)` + `.safeAreaBar(edge:)` | Pages/Materials/ScrollEdgeEffectDemo.swift |  |
| 族 | Materials | `4331:12157` | 10 | 已实现 | `.ultraThickMaterial`、`.thickMaterial`、`.regularMaterial`、`.thinMaterial`、`.ultraThinMaterial` | Pages/Materials/MaterialsDemo.swift |  |
| 族 | Liquid Glass - Large | `483:9237` | 2 | 部分实现 | `.glassEffect(.regular / .clear, in:)` | Pages/Materials/LiquidGlassDemo.swift、GlassSwatch.swift | Glass 只有 .regular / .clear / .identity，折射强度由系统按尺寸调整，不能指定 Large |
| 族 | Liquid Glass - Medium | `483:9250` | 2 | 部分实现 | 同 Large | Pages/Materials/LiquidGlassDemo.swift | 不能指定 Medium |
| 族 | Liquid Glass - Small | `483:9263` | 8 | 已实现 | `.glassEffect(.regular.interactive(), in: .circle)`；Primary 用 `.regular.tint(.accentColor)` | Pages/Materials/LiquidGlassSmallDemo.swift、SmallGlassButton.swift | Active: False 环境模拟 |

### 令牌页

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 令牌 | 颜色 | — | — | 已实现 | `Color(.sRGB, red:green:blue:opacity:)` 色块 + `LinearGradient` | Pages/Tokens/TokenColorsPage.swift、ColorTokenSwatch.swift、GradientTokenSwatch.swift | 数据：tokens/colors.json |
| 令牌 | 文字样式 | — | — | 已实现 | `.font(.system(size:weight:design:))` + `.tracking` 真实渲染 | Pages/Tokens/TokenTypographyPage.swift、TextStyleRow.swift | 数据：tokens/typography.json；Figma 数值字重（如 510、590）映射到最接近的 Font.Weight |
| 令牌 | 效果与材质 | — | — | 已实现 | GLASS → `.glassEffect`，BACKGROUND_BLUR → `.ultraThinMaterial`，阴影 → `.shadow` / `.shadow(.inner(...))`，LAYER_BLUR → `.blur` | Pages/Tokens/TokenEffectsPage.swift、EffectTokenSwatch.swift | 数据：tokens/effects.json；Figma 模糊半径按一半换算成 SwiftUI 半径 |
| 令牌 | 几何 | — | — | 已实现 | 按数值画圆角矩形、间距块，组件尺寸列表 | Pages/Tokens/TokenGeometryPage.swift、CornerRadiusSwatch.swift、SpacingSwatch.swift | 数据：tokens/geometry.json |
