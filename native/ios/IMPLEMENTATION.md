# iOS 27 原生实现登记表

> 骨架由 `tools/gen-docs.py` 首次生成，之后由开发 agent 维护，**脚本不再覆盖**。
> 需求见 [native-ios-app.md](../../docs/native-ios-app.md)，组件清单见 [ios-components.md](../../docs/ios-components.md)。
> 状态只用五个值：`未开始`、`已实现`、`部分实现`、`无法实现`、`内部件`。每实现一个族就立即更新它的行；`无法实现` 必须写原因。

## 外壳与全局说明

- 文件路径相对 `native/ios/ComponentGalleryiOS/Pages/`。每个页面一个 `<PageName>Page`，由 `PageRouter` 按 slug 分发；页面骨架统一用 `Common/PageScaffold.swift`。
- 外壳在 `Shell/`：`GalleryView`（翻页、浮窗、面板）、`SwitcherPanel`（搜索、设备筛选、明暗开关）。明暗用根视图的 `.preferredColorScheme`，所有 `Mode: Light / Dark` 轴都由它控制。
- 翻页快捷键用 `.keyboardShortcut(.leftArrow / .rightArrow, modifiers: [])` 挂在上一页 / 下一页按钮上，没有用 `.onKeyPress`：后者需要一个获得焦点的视图，在 iPad 外接键盘上会显示焦点框。`⌘K` 用 `.keyboardShortcut("k", modifiers: .command)`。
- 整屏模拟图用 `Common/MockScreen.swift` 按 Figma 宽高比 fit-to-width，不出现横向滚动。
- UIKit 只出现在 Keyboards 页（级别「部分」）：`.keyboardType` 的参数类型 `UIKeyboardType`。其余页面没有 UIKit / `UIViewRepresentable`。
- 「交互态」指 Pressed、Selected、Typing、Open 等无法静态强制的状态：页面里放真实控件并用灰色手势提示说明操作方法。

### Sidebars

分类 `01-navigation`　SwiftUI 对应：**原生**　`NavigationSplitView`、`TabView` + `.tabViewStyle(.sidebarAdaptable)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | BG | `10472:45236` | 2 | 已实现 | `List(selection:)` + `.listStyle(.sidebar)` | `Sidebars/SidebarBGDemo.swift` | Active: False 无法静态强制：窗口失焦时的灰色选中底由系统切换 |
| 族 | Sidebar Row | `131:70029` | 12 | 已实现 | `List(selection:)` + `.listStyle(.sidebar)`，`DisclosureGroup` 嵌套产生 Indent 1–2，`.disabled(true)` | `Sidebars/SidebarRowDemo.swift` | 12 个变体合并在一个列表里展示 |
| 族 | Sidebar | `10464:33764` | 2 | 部分实现 | `NavigationSplitView` + `.searchable(placement: .sidebar)` | `Sidebars/SplitViewSample.swift`、`Sidebars/SidebarDemo.swift` | Floating Window: True 由系统决定，无法强制；窄屏自动折叠成单栏 |
| 独立 | Section Header | `131:66427` | — | 已实现 | `Section(_:isExpanded:)` + `.listStyle(.sidebar)` | `Sidebars/SidebarSectionHeaderDemo.swift` |  |
| 独立 | Sidebar Search Field | `5840:30516` | — | 已实现 | `NavigationStack` + `.searchable(placement: .navigationBarDrawer(displayMode: .always))` | `Sidebars/SidebarSearchFieldDemo.swift` |  |
| 内部件·族 | _Sidebar - Trailing | `5643:28168` | 24 | 内部件 |  |  |  |
| 内部件·族 | _Sidebar - Edit Button | `5659:15001` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Sidebar - Leading | `147:62237` | 16 | 内部件 |  |  |  |
| 内部件·族 | _Trailing - Disclosure | `5643:20203` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Search Field | `5840:30471` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Selection BG | `5840:25291` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Section Header | `5840:30052` | 2 | 内部件 |  |  |  |

### Tab Bars

分类 `01-navigation`　SwiftUI 对应：**原生**　`TabView` + `Tab`、`.tabBarMinimizeBehavior`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Tab Bar - iPhone | `3:70967` | 24 | 已实现 | `TabView(selection:)` + `Tab`、`Tab(value:role: .search)`、`Tab(_:systemImage:value:role: .prominent)`、`.tabBarMinimizeBehavior(.onScrollDown / .never)` | `TabBars/TabBarSample.swift`、`TabBars/TabBarCanvas.swift` | Tabs 2–5 用 Stepper 切换；Minimized: True 为交互态（在演示区向下滚动） |
| 族 | Tab Bar - iPhone Duo | `12887:20935` | 24 | 部分实现 | 同 Tab Bar - iPhone | `TabBars/TabBarsPage.swift` | 外屏竖排标签栏由系统按显示屏自动切换，需在 iPhone Duo 模拟器查看 |
| 独立 | Tab Bar - iPad | `2524:7957` | — | 部分实现 | `TabView` + `.tabViewStyle(.sidebarAdaptable)` | `TabBars/TabBarCanvas.swift` | 顶部标签栏只在 iPad 宽度下出现 |
| 内部件·族 | _Tab Bar Button - iPad - Text | `5735:64660` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Tab Bar Button - iPad - Symbol | `5735:64661` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Tab Bar Button Round - iPhone | `5735:65306` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Tab Bar Button - iPhone Duo | `12887:21456` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Tab Bar Button Round - iPhone Duo | `12887:21567` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Tab Bar Button - iPhone | `5735:65307` | 4 | 内部件 |  |  |  |

### Windows

分类 `01-navigation`　SwiftUI 对应：**原生**　`WindowGroup`、iPad 多窗口

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Window with Sidebar | `12492:2483` | 2 | 部分实现 | `NavigationSplitView` | `Sidebars/SplitViewSample.swift`、`Windows/WindowsPage.swift` | Mode: Inactive 由系统决定；窗口外框与控制按钮由系统绘制 |
| 独立 | Window | `5588:3741` | — | 部分实现 | `WindowGroup(id:)` + `@Environment(\.openWindow)`、`supportsMultipleWindows` | `Windows/NewWindowButton.swift` | 窗口外框、控制按钮、缩放手柄由系统绘制；iPhone 不支持多窗口，按钮禁用 |
| 内部件·族 | _Window Controls | `5565:22697` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Window Resize | `10472:45051` | 2 | 内部件 |  |  |  |

### Status Bars and Menu Bars

分类 `02-bars`　SwiftUI 对应：**自绘**　状态栏由系统绘制，SwiftUI 只能用 `.toolbarVisibility(_:for: .statusBar)` 显隐；其余自绘示意

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Status bar and Menu bar- iPad | `5413:10006` | 4 | 已实现 | 自绘：`HStack` + `.bar` 材质，菜单项为文字 | `StatusBars/SimIPadStatusBar.swift` | 4 个变体全部模拟 |
| 族 | Status bar - iPhone Duo | `12884:7911` | 2 | 已实现 | 自绘：`AnyLayout` 切换横排 / 竖排 | `StatusBars/SimDuoStatusBar.swift` |  |
| 族 | Status Bar - iPhone | `12961:29589` | 3 | 已实现 | 自绘 + 真实 `.toolbarVisibility(_:for: .statusBar)` 开关 | `StatusBars/SimIPhoneStatusBar.swift`、`StatusBars/StatusBarIPhoneDemo.swift` | 三个机型只有灵动岛尺寸差别，模拟图相同 |
| 独立 | iPad - Leading Accessories | `10465:36399` | — | 已实现 | 自绘：时间 + 日期 | `StatusBars/SimIPadLeadingAccessories.swift` |  |
| 独立 | iPad - Trailing Accessories | `10465:36393` | — | 已实现 | 自绘：`cellularbars`、`wifi`、`battery.100percent` 符号 | `StatusBars/SimStatusIcons.swift` |  |
| 内部件·族 | _Menu bar item | `5413:10045` | 4 | 内部件 |  |  |  |

### Toolbars

分类 `02-bars`　SwiftUI 对应：**原生**　`.toolbar`、`ToolbarItem(placement:)`、`ToolbarSpacer`、`ToolbarOverflowMenu`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Toolbar - Top - iPad | `5561:41165` | 8 | 部分实现 | `.navigationTitle` + `.navigationSubtitle` + `.toolbarTitleDisplayMode(.inline/.large/.inlineLarge)`；`ToolbarItem(placement: .topBarLeading/.primaryAction)`、`ToolbarItemGroup(placement: .secondaryAction)`；Tab Bar: True 用 `TabView` + `.sidebarAdaptable` 包裹 | `Toolbars/TopToolbarDemo.swift`、`Toolbars/TopToolbarStack.swift`、`Toolbars/TopToolbarCanvas.swift` | Style 为近似映射：Compact Large → `.inlineLarge`，Title 2 Line → 加副标题，Title 2 Line Left → `.inlineLarge` + 副标题；顶部标签栏只在 iPad 宽度出现 |
| 族 | Toolbar - Top - iPhone Duo | `12883:6008` | 8 | 部分实现 | 同 Toolbar - Top - iPad；Sheet: True 用 `.sheet` + `.cancellationAction` / `.confirmationAction` | `Toolbars/TopToolbarDemo.swift`、`Toolbars/SheetToolbarContent.swift` | 外屏竖排工具栏需在 iPhone Duo 模拟器查看；Style 映射同上 |
| 族 | Toolbar - Top - iPhone | `1:54472` | 5 | 已实现 | 同 Toolbar - Top - iPad（无附加轴） | `Toolbars/TopToolbarDemo.swift`、`Toolbars/TopToolbarStack.swift` | Style 映射同上 |
| 族 | Toolbar - Bottom - iPhone | `4:55732` | 6 | 已实现 | `ToolbarItem(placement: .bottomBar)`、`ToolbarSpacer(.flexible, placement: .bottomBar)`、`ToolbarItem(placement: .status)`、`DefaultToolbarItem(kind: .search, placement: .bottomBar)` + `.searchable`、`.searchFocused` | `Toolbars/BottomToolbarDemo.swift`、`Toolbars/BottomToolbarSample.swift`、`Toolbars/PageDots.swift` | 页码点为 SwiftUI 自绘（工具栏里没有系统页码控件）；Search with Focus 用按钮触发聚焦 |
| 独立 | Toolbar - Bottom - iPad | `8515:13163` | — | 部分实现 | 同 Toolbar - Bottom - iPhone（Buttons） | `Toolbars/BottomToolbarDemo.swift` | iPad 宽度与按钮间距需在 iPad 查看 |
| 内部件·族 | _Toolbar page control | `5704:38375` | 35 | 内部件 |  |  |  |
| 内部件·族 | _Back Bar Button Item | `5431:813` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Button - Text | `5429:6984` | 8 | 内部件 |  |  |  |
| 内部件·族 | _Button - Text - Prominent | `10479:19510` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Button - Symbol | `5426:2003` | 8 | 内部件 |  |  |  |
| 内部件·族 | _Button - Symbol - Prominent | `10479:19527` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Segmented Control Button | `5573:24524` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Search Accessory | `5573:24624` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Search - 44pt | `5720:33677` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Buttons - 44pt | `5720:29596` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Search - 48pt | `5720:33170` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Buttons - 48pt | `5720:47981` | 10 | 内部件 |  |  |  |
| 内部件·族 | _Title - iPhone Duo - Large Title | `12884:8278` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Title - iPhone - Large Title | `5827:57551` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Title - iPhone - Subheadline | `5827:57557` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Title - iPhone - Body | `5827:57554` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Subtitle - iPhone - Caption | `5827:57563` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Subtitle - iPhone - Subheadline | `5827:57560` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Page Dots | `5811:30646` | 4 | 内部件 |  |  |  |

### Activity Views

分类 `03-controls`　SwiftUI 对应：**原生**　`ShareLink`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Overlay | `5846:3358` | — | 已实现 | `ShareLink`（遮罩随分享面板由系统绘制） | `ActivityViews/ShareSheetDemo.swift` | 交互态：点击后出现 |
| 独立 | Activity View - iPad | `128:60578` | — | 已实现 | `ShareLink`（iPad 上为 popover） | `ActivityViews/ShareSheetDemo.swift` | 交互态 |
| 独立 | Activity View | `128:58645` | — | 已实现 | `ShareLink`（iPhone 上为 sheet） | `ActivityViews/ShareSheetDemo.swift` | 交互态 |
| 内部件·族 | _Actions | `5591:68347` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Separator | `10465:35555` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Close Button | `5591:28787` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Button - Liquid Glass | `5591:67812` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Action | `13112:4452` | 2 | 内部件 |  |  |  |
| 内部件·族 | _App | `13066:19803` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Contact | `127:58423` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Header | `127:59083` | 2 | 内部件 |  |  |  |
| 内部件·独立 | _Actions | `13066:19677` | — | 内部件 |  |  |  |
| 内部件·独立 | _Apps | `13066:19391` | — | 内部件 |  |  |  |
| 内部件·独立 | _Contacts | `13066:20042` | — | 内部件 |  |  |  |

### Buttons

分类 `03-controls`　SwiftUI 对应：**原生**　`Button` + `.buttonStyle(.automatic/.bordered/.borderedProminent/.borderless/.plain/.glass/.glassProminent)`、`.controlSize`、`.buttonBorderShape`、`.tint`、`Button(role: .destructive)`、`.disabled`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Button - Content Area | `40:58696` | 108 | 已实现 | `Button(_:systemImage:role:)` + `.buttonStyle(.borderless/.bordered/.borderedProminent)` + `.controlSize(.large/.regular/.small)` + `.labelStyle(.iconOnly/.titleOnly/.titleAndIcon)` + `.disabled` | `Buttons/ContentAreaButtonsDemo.swift`、`Buttons/StyledDemoButton.swift`、`Buttons/DemoLabelStyle.swift` | 108 个变体全部静态展示；Medium → `.regular` |
| 族 | Button - Liquid Glass - Text | `5473:21667` | 24 | 已实现 | `.buttonStyle(.glass/.glassProminent)` + `.controlSize` + `role: .destructive` + `.disabled` | `Buttons/GlassTextButtonsDemo.swift` | 24 个变体全部静态展示，彩色底图上看折射 |
| 族 | Button - Liquid Glass - Symbol | `5522:11866` | 8 | 已实现 | `.buttonStyle(.glass/.glassProminent)` + `.buttonBorderShape(.circle)` + `.labelStyle(.iconOnly)` | `Buttons/GlassSymbolButtonsDemo.swift` | 8 个变体全部静态展示 |
| 内部件·族 | _Label - Symbol - Preferred | `5522:11886` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Label - Symbol - Default | `5522:11873` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Label - Symbol - Destructive Default | `10456:14165` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Label - Text | `10462:31914` | 24 | 内部件 |  |  |  |

### Color Pickers

分类 `03-controls`　SwiftUI 对应：**原生**　`ColorPicker`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Picker Button | `5739:34128` | 4 | 部分实现 | `ColorPicker` + `.labelsHidden()` + `.controlSize(.large/.small)` | `ColorPickers/PickerButtonDemo.swift` | Selected: True 无法静态强制（只在颜色面板打开时出现）；iOS 色块可能不随 controlSize 变化 |
| 独立 | Color Picker - iPad | `515:56319` | — | 已实现 | `ColorPicker(_:selection:supportsOpacity:)`（iPad 为 popover） | `ColorPickers/ColorPickerPanelDemo.swift` | 交互态：点击色块打开 |
| 独立 | Color Picker - iPhone | `0:5275` | — | 已实现 | `ColorPicker(_:selection:supportsOpacity:)`（iPhone 为 sheet） | `ColorPickers/ColorPickerPanelDemo.swift` | 交互态 |
| 内部件·族 | _Button | `5704:26179` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Title | `5831:1408` | 2 | 内部件 |  |  |  |
| 内部件·独立 | _Toolbar | `5584:57400` | — | 内部件 |  |  |  |

### Empty States

分类 `03-controls`　SwiftUI 对应：**原生**　`ContentUnavailableView`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Empty States | `5583:24408` | 3 | 已实现 | `ContentUnavailableView`（`init(_:systemImage:description:)` 与 `label:description:` 两种写法） | `EmptyStates/EmptyStatesDemo.swift` | Symbol in Circle 的圆形底为 `.background(.fill.secondary, in: .circle)` |

### Page Controls

分类 `03-controls`　SwiftUI 对应：**原生**　`TabView` + `.tabViewStyle(.page)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Page Control | `10520:3448` | 3 | 已实现 | `TabView` + `.tabViewStyle(.page)` + `.indexViewStyle(.page(backgroundDisplayMode: .always))` | `PageControls/PagedSample.swift`、`PageControls/PageControlDemo.swift` | Pages 1-6 用 5 页、8+ 用 12 页展示 |
| 内部件·族 | _Page Indicator | `10520:3260` | 6 | 内部件 |  |  |  |

### Pop-up Buttons

分类 `03-controls`　SwiftUI 对应：**原生**　`Picker` + `.pickerStyle(.menu)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Popup Button | `410:50387` | 2 | 已实现 | `Picker` + `.pickerStyle(.menu)` + `.disabled` | `PopUpButtons/PopupButtonDemo.swift` |  |

### Progress Indicators

分类 `03-controls`　SwiftUI 对应：**原生**　`ProgressView`、`Gauge`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Progress Bar - Determinate Linear | `9:55875` | 11 | 已实现 | `ProgressView(value:total:)` | `ProgressIndicators/DeterminateProgressDemo.swift` | 11 个值全部展示 |
| 族 | Progress Bar - Indeterminate Circular ("Spinner") | `5425:3431` | 3 | 已实现 | `ProgressView()` + `.controlSize(.small/.regular/.large)` | `ProgressIndicators/SpinnerDemo.swift` |  |

### Segmented Controls

分类 `03-controls`　SwiftUI 对应：**原生**　`Picker` + `.pickerStyle(.segmented)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Segmented Control | `10460:145` | 4 | 已实现 | `Picker` + `.pickerStyle(.segmented)` + `.controlSize(.small/.large)` + `.disabled` | `SegmentedControls/SegmentedSample.swift`、`SegmentedControls/SegmentedControlDemo.swift` |  |
| 内部件·族 | _Option | `10456:16913` | 2 | 内部件 |  |  |  |

### Sliders

分类 `03-controls`　SwiftUI 对应：**原生**　`Slider`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Sliders | `7:53847` | 15 | 已实现 | `Slider(value:)` + `.disabled` | `Sliders/SlidersDemo.swift` | Idle、Disabled 各 5 个值静态展示；Pressed 为交互态 |
| 内部件·独立 | _Ticks | `5430:5333` | — | 内部件 |  |  |  |
| 内部件·独立 | _Track | `5428:5456` | — | 内部件 |  |  |  |
| 内部件·独立 | _Fill | `5441:3942` | — | 内部件 |  |  |  |
| 内部件·独立 | _Knob - Idle | `520:49468` | — | 内部件 |  |  |  |
| 内部件·独立 | _Knob - Pressed | `10456:2324` | — | 内部件 |  |  |  |

### Steppers

分类 `03-controls`　SwiftUI 对应：**原生**　`Stepper`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Stepper | `5415:17699` | — | 已实现 | `Stepper(_:value:in:)` | `Steppers/StepperDemo.swift` | 到达边界时系统自动禁用对应按钮 |
| 内部件·族 | _Decrement | `5415:17684` | 3 | 内部件 |  |  |  |
| 内部件·族 | _Increment | `5415:17691` | 3 | 内部件 |  |  |  |

### Toggles

分类 `03-controls`　SwiftUI 对应：**原生**　`Toggle`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Toggle - Switch | `29:56814` | 8 | 已实现 | `Toggle(_:isOn:)` + `.disabled` | `Toggles/ToggleDemo.swift` | Is On × Is Enabled 4 种静态展示；Pressed 为交互态 |

### Date and Time Pickers

分类 `04-input`　SwiftUI 对应：**原生**　`DatePicker`（`.compact`、`.graphical`、`.wheel`）

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Date and time - Collapsed | `30:53803` | 2 | 已实现 | `DatePicker` + `.datePickerStyle(.compact)` | `DateAndTimePickers/DateCollapsedDemo.swift` | Selected 为交互态 |
| 族 | Date and time - Pickers | `5442:1885` | 2 | 已实现 | `DatePicker` + `.datePickerStyle(.graphical)`（Inline）/ `.compact` | `DateAndTimePickers/DatePickersDemo.swift` |  |
| 内部件·族 | _Day | `50:63907` | 5 | 内部件 |  |  |  |
| 内部件·独立 | _Week | `50:63951` | — | 内部件 |  |  |  |

### Keyboards

分类 `04-input`　SwiftUI 对应：**部分**　键盘本体由系统绘制，用 `TextField` + `.keyboardType` 触发真实键盘；配件栏用 `ToolbarItemGroup(placement: .keyboard)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Accessory Bar - iPhone/Search | `12892:51480` | 2 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容） | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Accessory Bar - iPhone/Toolbar | `5522:14771` | 4 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容） | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Accessory Bar - iPhone/Find | `5720:47982` | 2 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容） | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Accessory Bar - iPhone/URL | `6334:12943` | 2 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容），`.keyboardType(.URL)` | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Accessory Bar - iPhone/Web Form | `6334:13068` | 2 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容），上一个 / 下一个切换 `@FocusState` | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Accessory Bar - iPhone/Find and Replace | `5720:48008` | 2 | 部分实现 | `TextField` + `.keyboardType` + `.submitLabel` + `ToolbarItemGroup(placement: .keyboard)`（整页一个，按 `@FocusState` 切换内容），两个输入框互相切换焦点 | `Keyboards/KeyboardsPage.swift`、`Keyboards/KeyboardAccessoryItems.swift`、`Keyboards/KeyboardFieldRow.swift` | UIKit 用途：`.keyboardType` 的参数类型是 `UIKeyboardType`（页面级别为「部分」）；键盘本体由系统绘制，配件栏按钮为近似内容 |
| 族 | Keyboard | `106:60296` | 9 | 部分实现 | `TextField` + `.keyboardType(.default/.numbersAndPunctuation/.emailAddress/.URL/.webSearch/.numberPad)` | `Keyboards/KeyboardField.swift`、`Keyboards/KeyboardFieldRow.swift` | Upper / Lower Case、Punctuation 为键盘内部状态需手动切换；Emoji 没有对应 keyboardType |
| 族 | Keyboard | `12890:26716` | 16 | 部分实现 | 同上 | `Keyboards/KeyboardsPage.swift` | Display、Orientation 由设备决定，需在 iPhone Duo 模拟器折叠 / 旋转查看 |
| 族 | Keyboard | `128:78692` | 2 | 部分实现 | 同上 | `Keyboards/KeyboardsPage.swift` | iPad 键盘需在 iPad 模拟器查看；Shift 为内部状态 |
| 内部件·族 | _Autocorrection | `107:60726` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Suggestion | `6334:14398` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Number Pad | `106:59724` | 6 | 内部件 |  |  |  |
| 内部件·族 | _Keys - iPhone | `107:59926` | 32 | 内部件 |  |  |  |
| 内部件·族 | _Previous | `117:72001` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Next | `117:72004` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Symbol | `5522:15639` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Field - BG | `5522:15881` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Field - Find | `5522:14987` | 8 | 内部件 |  |  |  |
| 内部件·族 | _Field - Replace | `5522:15558` | 8 | 内部件 |  |  |  |
| 内部件·族 | _Replace Button | `5522:17108` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Button - Symbol Keyboard | `5522:14754` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Bottom Buttons | `5915:55555` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Emoji Tabs | `5915:55559` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Search Emoji | `5915:57672` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Keys - iPhone Duo | `12890:26651` | 128 | 内部件 |  |  |  |
| 内部件·族 | _Bottom Buttons | `12891:37182` | 16 | 内部件 |  |  |  |
| 内部件·族 | _Background - Keyboard | `537:133478` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Accessory Bar - iPad - Buttons/Light | `128:86044` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Accessory Bar - iPad - Buttons/Dark | `5915:35196` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Keys - iPad - Command | `128:81134` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Keys - iPad - Return | `204:69463` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Keys - iPad - Lowercase | `128:81135` | 8 | 内部件 |  |  |  |
| 内部件·族 | _Keyboard Layouts/iPad/Lowercase | `128:80224` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Accessory Bar - iPad | `5915:33970` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Keyboard Layouts/iPad/Uppercase | `10462:32786` | 2 | 内部件 |  |  |  |

### Text Fields

分类 `04-input`　SwiftUI 对应：**原生**　`TextField`、`SecureField`、`TextEditor`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Text Field | `553:23047` | 4 | 已实现 | `TextField` + `.textFieldStyle(.roundedBorder)` + `@FocusState` | `TextFields/TextFieldDemo.swift` | Focused 用按钮触发（避免进页即弹键盘）；Typing 为交互态 |

### Lists

分类 `05-collections`　SwiftUI 对应：**原生**　`List`、`.listStyle(.insetGrouped/.plain/.grouped)`、`Section`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Row - Button | `550:49677` | 3 | 已实现 | `List` + `Button` / `Button(role: .destructive)` / `.disabled` + `.listStyle(.insetGrouped)` | `Lists/RowButtonDemo.swift` |  |
| 族 | Row | `550:50430` | 2 | 已实现 | `LabeledContent`、双行 `Label` | `Lists/RowDemo.swift` |  |
| 族 | Index Bar | `48:56457` | 2 | 已实现 | `.sectionIndexLabel(_:)` + `.listSectionIndexVisibility(.visible)` | `Lists/IndexBarDemo.swift` | Device 轴由运行设备决定 |
| 族 | Row with Swipe Actions | `550:49969` | 6 | 已实现 | `.swipeActions(edge: .leading/.trailing)` + `.labelStyle` | `Lists/SwipeRowsDemo.swift`、`Lists/SwipeRow.swift` | Swipe 为交互态；Symbol and Label 由系统按宽度决定是否显示文字 |
| 族 | Header | `517:38042` | 3 | 部分实现 | `Section(content:header:)` + `.headerProminence(.increased)` | `Lists/HeaderDemo.swift` | Extra Prominent 没有系统级别，用 `.title2` 粗体近似 |
| 独立 | Grouped Table Footer | `35:55757` | — | 已实现 | `Section(content:footer:)` | `Lists/GroupedFooterDemo.swift` |  |
| 独立 | Section Title | `50:56535` | — | 已实现 | `Section(_:content:)` | `Lists/SectionTitleDemo.swift` |  |
| 内部件·族 | _Separator | `5469:7924` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Edit Buttons/Light | `20:60364` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Images/Regular | `24:55973` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Images/Tall | `508:72799` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Trailing | `212:117586` | 9 | 内部件 |  |  |  |
| 内部件·族 | _Header Trailing Accessories | `39:67340` | 4 | 内部件 |  |  |  |
| 内部件·独立 | _Swipe Actions/Symbol only | `27:68008` | — | 内部件 |  |  |  |
| 内部件·独立 | _Swipe Actions/Symbol and Label | `10472:44894` | — | 内部件 |  |  |  |
| 内部件·独立 | _Swipe Actions/Symbol and Label Stacked | `27:68007` | — | 内部件 |  |  |  |
| 内部件·独立 | _Grabber | `5533:12351` | — | 内部件 |  |  |  |

### Action Sheets

分类 `06-overlays`　SwiftUI 对应：**原生**　`.confirmationDialog`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | Action Sheet | `5446:10266` | — | 已实现 | `.confirmationDialog(_:isPresented:titleVisibility:)`，挂在触发按钮上 | `ActionSheets/ActionSheetDemo.swift` | 交互态 |

### Alerts

分类 `06-overlays`　SwiftUI 对应：**原生**　`.alert(_:isPresented:actions:message:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Alert | `63:57121` | 2 | 已实现 | `.alert(_:isPresented:actions:message:)`：2 个按钮并排，3 个竖排 | `Alerts/AlertDemo.swift` | 交互态 |
| 独立 | Text Field | `12616:942` | — | 已实现 | `.alert` + `TextField` | `Alerts/AlertTextFieldDemo.swift` | 交互态 |
| 内部件·族 | _Text Field Background | `5469:8384` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Buttons | `5446:6653` | 8 | 内部件 |  |  |  |
| 内部件·独立 | _Overlay - Alerts | `12956:27840` | — | 内部件 |  |  |  |

### Contextual Menus

分类 `06-overlays`　SwiftUI 对应：**原生**　`.contextMenu`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Context Menu | `125:58750` | 4 | 部分实现 | `.contextMenu` + `ControlGroup`（Horizontal）+ `.contentShape(.contextMenuPreview, _:)` | `ContextualMenus/ContextMenuDemo.swift` | Side: Leading / Trailing 由系统按位置决定 |
| 独立 | Context Menu - Dimming Overlay | `128:76929` | — | 已实现 | `.contextMenu`（遮罩由系统绘制） | `ContextualMenus/ContextMenuDemo.swift` | 交互态 |

### Menus

分类 `06-overlays`　SwiftUI 对应：**原生**　`Menu`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Section Title | `5855:4981` | 2 | 已实现 | `Menu` + `Section(_:)` | `Menus/MenuDemo.swift` | Mode 跟随全局 |
| 族 | Separator | `5855:5763` | 2 | 已实现 | `Menu` + `Divider()` | `Menus/MenuDemo.swift` | Mode 跟随全局 |
| 族 | Menu Items | `5502:6049` | 12 | 已实现 | `Menu` + `Button` / `role: .destructive` / `.disabled`，`Toggle` 产生选中勾 | `Menus/MenuDemo.swift` | Mode 跟随全局 |
| 族 | Menu Items - Submenus | `5848:33925` | 16 | 已实现 | 嵌套 `Menu` + `Picker` + `.disabled` | `Menus/MenuDemo.swift` | Open 为交互态；Mode 跟随全局 |
| 族 | Quick Action | `5498:16565` | 4 | 已实现 | `Menu` + `ControlGroup` | `Menus/MenuDemo.swift` | Mode 跟随全局 |
| 族 | Menu | `5908:6487` | 2 | 已实现 | `Menu`（ControlGroup、Section、子菜单、Toggle、Divider 组合） | `Menus/MenuDemo.swift` | Mode 跟随全局 |
| 独立 | Text Selection | `5711:35414` | — | 已实现 | `TextField(_:text:axis: .vertical)` 上的系统选择手柄 | `Menus/TextSelectionDemo.swift` | 交互态 |
| 独立 | Edit Menu | `5713:47505` | — | 已实现 | 同上，选中后出现系统编辑菜单 | `Menus/TextSelectionDemo.swift` | 交互态 |
| 内部件·族 | _Selection | `5853:4742` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Edit Menu Item | `5713:49111` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Menu Indicator | `5831:53946` | 2 | 内部件 |  |  |  |

### Popovers

分类 `06-overlays`　SwiftUI 对应：**原生**　`.popover(isPresented:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Popovers (iPad Only) | `61:65421` | 12 | 已实现 | `.popover(isPresented:arrowEdge:)` + `.presentationCompactAdaptation(.popover)`，按钮按 Edge 放到 9 个位置 | `Popovers/PopoverDemo.swift`、`Popovers/PopoverEdge.swift` | 空间不够时系统会换边 |

### Sheets

分类 `06-overlays`　SwiftUI 对应：**原生**　`.sheet(isPresented:)` + `.presentationDetents`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Grabber | `5827:57566` | 2 | 已实现 | `.presentationDragIndicator(.visible)` | `Sheets/SheetLauncher.swift`、`Sheets/SheetBody.swift` | Mode 跟随全局 |
| 族 | Sheet - iPhone | `10525:1632` | 3 | 已实现 | `.sheet(isPresented:)` + `.presentationDetents([.medium] / [.large])`，sheet 上再叠 sheet | `Sheets/SheetLauncher.swift`、`Sheets/SheetBody.swift` | 交互态 |
| 独立 | Overlay | `5551:18479` | — | 已实现 | `.sheet`（遮罩由系统绘制） | `Sheets/SheetLauncher.swift` | 交互态 |
| 独立 | Sheet - iPad | `5719:30145` | — | 已实现 | `.sheet` + `.presentationSizing(.form)` | `Sheets/SheetLauncher.swift` | 表单尺寸只在 iPad 上体现 |

### Product Bezels

分类 `07-system`　SwiftUI 对应：**不做**　设备外框，无对应 API

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | iPad Pro M4 13" | `6316:14232` | 2 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPad Pro M4 11" | `6316:14229` | 2 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone Duo | `12887:20891` | 8 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone 17 Pro | `6316:14140` | 3 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone 17 | `6316:14198` | 5 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone Air | `6316:14172` | 4 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone 17 Pro Max | `6316:14155` | 3 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone 18 Pro | `12887:20847` | 4 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 族 | iPhone 18 Pro Max | `12887:20854` | 4 | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |
| 独立 | iPad mini | `5456:18828` | — | 无法实现 | — | `ProductBezels/ProductBezelsPage.swift` | 设备外框是营销素材，没有对应的 SwiftUI API（级别「不做」），页面显示原因卡片 |

### System

分类 `07-system`　SwiftUI 对应：**自绘**　主屏幕、锁屏、控制中心、壁纸、Home Indicator 由系统绘制，只能用 SwiftUI 模拟外观

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Home Screen - iPad | `595:43249` | 5 | 已实现 | 自绘：`MockScreen` 按设计宽高比缩放 + `SimWallpaper` + `SimIconGrid` + `SimDock`（`.glassEffect`）+ `SimWidget` | `System/HomeScreenFamilyDemo.swift`、`System/SimHomeScreen.swift` | 主屏幕由系统绘制；5 个变体全部模拟 |
| 族 | Home Screen - iPhone Duo | `13138:22625` | 3 | 已实现 | 自绘：`MockScreen` 按设计宽高比缩放 + `SimWallpaper` + `SimIconGrid` + `SimDock`（`.glassEffect`）+ `SimWidget` | `System/HomeScreenFamilyDemo.swift`、`System/DuoDisplay.swift` | 3 个变体全部模拟 |
| 族 | Home Screen - iPhone | `561:5800` | 5 | 已实现 | 自绘：`MockScreen` 按设计宽高比缩放 + `SimWallpaper` + `SimIconGrid` + `SimDock`（`.glassEffect`）+ `SimWidget` | `System/HomeScreenFamilyDemo.swift` | 5 个变体全部模拟 |
| 族 | Home Indicator | `106:60033` | 4 | 已实现 | 自绘：`Capsule` | `System/HomeIndicatorDemo.swift`、`System/SimHomeIndicator.swift` | 宽度为近似值 |
| 族 | Wallpapers - iPhone | `5707:9420` | 2 | 已实现 | 自绘：`LinearGradient`，Mode 跟随全局 | `System/WallpaperFamilyDemo.swift`、`System/SimWallpaper.swift` |  |
| 族 | Wallpapers - iPhone Duo | `13138:25373` | 6 | 已实现 | 自绘：`LinearGradient`，Star White / Night Sky × 3 种显示屏尺寸 | `System/WallpaperFamilyDemo.swift` | 壁纸图案为渐变近似 |
| 族 | Wallpapers - iPad | `5707:11471` | 2 | 已实现 | 自绘：`LinearGradient`，Mode 跟随全局 | `System/WallpaperFamilyDemo.swift` |  |
| 族 | App Icon/iPhone | `13148:36338` | 2 | 已实现 | 自绘：`SimAppIcon`（多色渐变 / 单色） | `System/AppIconFamilyDemo.swift`、`System/SimAppIcon.swift` |  |
| 族 | App Icon/iPad | `2402:17543` | 2 | 已实现 | 自绘：`SimAppIcon` | `System/AppIconFamilyDemo.swift` |  |
| 独立 | Home Screen Quick Actions - iPad | `2607:25388` | — | 部分实现 | 自绘图标 + 真实 `.contextMenu` | `System/QuickActionsDemo.swift` | 真实快捷操作（UIApplicationShortcutItem）只在系统主屏幕出现 |
| 独立 | Home Screen Quick Actions - iPhone | `2607:25374` | — | 部分实现 | 自绘图标 + 真实 `.contextMenu` | `System/QuickActionsDemo.swift` | 同上 |
| 独立 | Control Center - iPad | `2606:21776` | — | 已实现 | 自绘：模糊壁纸 + `Grid` + `.glassEffect` 控制块 | `System/SimControlCenter.swift`、`System/SimControlTile.swift` | 控制中心由系统绘制 |
| 独立 | Control Center - iPhone | `2524:24489` | — | 已实现 | 自绘：同上 | `System/SimControlCenter.swift` | 控制中心由系统绘制 |
| 独立 | Lock Screen - iPad | `557:20781` | — | 已实现 | 自绘：日期、大号时间、玻璃按钮 | `System/SimLockScreen.swift`、`System/SimLockButton.swift` | 锁屏由系统绘制 |
| 独立 | Lock Screen - iPhone | `557:20840` | — | 已实现 | 自绘：同上 | `System/SimLockScreen.swift` | 锁屏由系统绘制 |
| 独立 | iPhone Duo/Outer Display Lens | `12887:18298` | — | 已实现 | 自绘：同心圆 | `System/SimOuterLens.swift` |  |
| 独立 | App Icon/iPhone/Home Indicator/_Badge | `5592:39416` | — | 已实现 | 自绘：`SimAppIcon(badge:)` | `System/SimAppIcon.swift` |  |
| 内部件·族 | _HSQA - App Icon - Light | `5624:50419` | 20 | 内部件 |  |  |  |
| 内部件·族 | _HSQA - Actions | `5622:50172` | 4 | 内部件 |  |  |  |
| 内部件·族 | _HSQA - Widget Row | `5622:50366` | 1 | 内部件 |  |  |  |
| 内部件·族 | _Controls - BG - iPad | `5626:53721` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPad - 2x2 | `2606:21979` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPad - 2x1 | `2606:21954` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPad - 1x1 | `2606:21949` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Controls - BG - iPhone | `5626:54577` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPhone - 2x2 | `2547:2629` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPhone - 2x1 | `2543:2523` | 4 | 内部件 |  |  |  |
| 内部件·族 | _Controls - iPhone - 1x1 | `2524:24525` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Launch Pad | `5593:38567` | 2 | 内部件 |  |  |  |
| 内部件·族 | _Dock Material | `10486:20740` | 2 | 内部件 |  |  |  |
| 内部件·族 | _App Icon/iPhone Duo | `13148:36339` | 6 | 内部件 |  |  |  |
| 内部件·独立 | _Home Screen Quick Actions | `2607:26472` | — | 内部件 |  |  |  |
| 内部件·独立 | _Controls - Lock Screen | `5592:28123` | — | 内部件 |  |  |  |
| 内部件·独立 | _Dock - iPad | `558:50382` | — | 内部件 |  |  |  |

### App Icons

分类 `07-system`　SwiftUI 对应：**自绘**　图标是资源文件，不是控件；用 `Image` 展示静态图或自绘

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 内部件·族 | _System Icons | `2402:669` | 94 | 内部件 |  |  |  |
| 内部件·族 | _Custom Icon | `2402:976` | 2 | 内部件 |  |  |  |
| 内部件·独立 | _Icon Grid | `2402:653` | — | 内部件 |  |  |  |

### Face ID

分类 `07-system`　SwiftUI 对应：**自绘**　认证界面由系统绘制（LocalAuthentication），只能自绘示意

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Face ID | `123:58236` | 2 | 已实现 | 自绘：`Image(systemName: "faceid")` + `.symbolEffect(.pulse)` + `.glassEffect` | `FaceID/SimFaceID.swift` | 认证界面由系统（LocalAuthentication）绘制 |

### Notifications

分类 `07-system`　SwiftUI 对应：**自绘**　通知横幅由系统绘制，只能用 SwiftUI 模拟外观

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Notification - Collapsed | `135:67787` | 3 | 已实现 | 自绘：`.glassEffect` 卡片，Stack 1–3 叠层 | `Notifications/SimNotification.swift`、`Notifications/SimNotificationCard.swift` | 通知横幅由系统绘制 |
| 族 | Overlay | `5551:17755` | 2 | 已实现 | 自绘：暗色遮罩，Mode 跟随全局 | `Notifications/NotificationsPage.swift` |  |
| 独立 | Notification - Collapsed - List | `135:73247` | — | 已实现 | 自绘：3 条通知列表 | `Notifications/NotificationsPage.swift` |  |
| 独立 | Notification - Expanded | `143:62847` | — | 已实现 | 自绘：展开态（图片 + 操作） | `Notifications/SimNotificationCard.swift` |  |
| 内部件·族 | _Time | `533:7109` | 2 | 内部件 |  |  |  |

### Widgets

分类 `07-system`　SwiftUI 对应：**部分**　WidgetKit 需要独立的 Widget Extension；v1 在 App 内用 SwiftUI 视图模拟小组件外观

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Home Screen Widget - iPhone | `143:214872` | 4 | 已实现 | 自绘：`SimWidget`（`.glassEffect`）按设计宽高比 | `Widgets/HomeWidgetFamilyDemo.swift`、`System/SimWidget.swift` | 真实小组件需独立 Widget Extension |
| 族 | Home Screen Widget - iPad | `144:109471` | 4 | 已实现 | 自绘：同上 | `Widgets/HomeWidgetFamilyDemo.swift` | 真实小组件需独立 Widget Extension |
| 独立 | Lock Screen Widget / Circular / Open Gauge 2 | `145:62670` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryCircular)`（含最小 / 最大值） | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Closed Gauge | `525:43689` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryCircularCapacity)` | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Open Gauge | `145:62699` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryCircular)` | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Open Gauge 3 | `525:43658` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryCircular)`（符号作当前值） | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Stack 3 Rows | `145:62733` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Icon | `525:43588` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Stack 2 Rows - Icon and Label | `525:43609` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget / Circular / Stack 2 Rows - Labels | `525:43610` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Inline | `145:62745` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Rectangular with Chart | `525:43083` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Modular with Bar | `525:43071` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryLinearCapacity)` | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Rectangular Text Gauge | `525:43106` | — | 已实现 | 真实 `Gauge` + `.gaugeStyle(.accessoryLinear)` | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Tall Body with Icon | `525:43115` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Tall Body | `525:43122` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Modular Columns | `525:43126` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Modular Table | `525:43141` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Modular Standard | `525:43148` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Modular List | `525:43156` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget - Clock | `525:43245` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget/2x2/Clock Big (iPad Only) | `526:38737` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |
| 独立 | Lock Screen Widget/2x2/Date (iPad Only) | `526:38824` | — | 已实现 | 自绘：按 kit 版式排布文字与符号 | `Widgets/LockWidgetView.swift`、`Widgets/LockWidgetContent.swift` | 锁屏背景与 `AccessoryWidgetBackground` 只在 Widget Extension 内可用，用半透明填充近似 |

### Colors

分类 `08-tokens`　SwiftUI 对应：**原生**　`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(uiColor:)`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 内部件·族 | _Swatch | `509:77730` | 4 | 内部件 |  |  |  |
| 内部件·独立 | _Swatch Grid | `5532:7800` | — | 内部件 |  |  |  |
| 内部件·独立 | _Swatch - Light and Dark | `0:4299` | — | 内部件 |  |  |  |

### Materials

分类 `08-tokens`　SwiftUI 对应：**原生**　`Material`、`.glassEffect(_:in:)`、`GlassEffectContainer`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 族 | Scroll Edge Effect - Soft | `5661:26943` | 2 | 已实现 | `.scrollEdgeEffectStyle(.soft, for: [.top, .bottom])`，真实顶部 / 底部工具栏 | `Materials/ScrollEdgeDemo.swift` | Edge 两个值同时展示，需滚动查看 |
| 族 | Scroll Edge Effect - Hard | `5661:26978` | 4 | 已实现 | `.scrollEdgeEffectStyle(.hard, for: [.top, .bottom])` | `Materials/ScrollEdgeDemo.swift` | Mode 跟随全局 |
| 族 | Liquid Glass - Regular - Large | `5584:32504` | 2 | 已实现 | `.glassEffect(.regular, in: .rect(cornerRadius: 34))` + `GlassEffectContainer` | `Materials/GlassDemo.swift`、`Materials/GlassShape.swift` | Mode 跟随全局 |
| 族 | Liquid Glass - Regular - Medium | `5584:32503` | 2 | 已实现 | `.glassEffect(.regular, in: .rect(cornerRadius: 24))` | `Materials/GlassDemo.swift` | Mode 跟随全局 |
| 族 | Liquid Glass - Regular - Small | `5584:32505` | 8 | 已实现 | `.glassEffect(.regular / .regular.interactive() / .regular.tint(.accentColor))` | `Materials/GlassDemo.swift` | Active: True 为交互态（按住）；Mode 跟随全局 |
| 独立 | Liquid Glass - Clear | `5914:23547` | — | 已实现 | `.glassEffect(.clear)` | `Materials/GlassDemo.swift` |  |
| 内部件·族 | _Materials/Mode Options | `510:78330` | 20 | 内部件 |  |  |  |
| 内部件·族 | _Materials | `510:79105` | 5 | 内部件 |  |  |  |

### Layout Guides

分类 `08-tokens`　SwiftUI 对应：**原生**　示意用：`.safeAreaInset`、`.safeAreaBar`、`.safeAreaPadding`、`.containerRelativeFrame`

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 独立 | iPhone Duo/Standard/Inner - Landscape - Folded | `13035:902` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Inner - Landscape - Folded | `13035:1548` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Standard/Inner - Landscape | `12892:62247` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Inner - Landscape | `12892:62243` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Standard/Inner - Portrait - Folded | `13035:1050` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Inner - Portrait - Folded | `13035:1403` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Standard/Inner - Portrait | `12892:62246` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Inner - Portrait | `12892:62242` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Standard/Outer - Landscape | `12892:62245` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Outer - Landscape | `12892:62241` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Standard/Outer - Portrait | `12892:62244` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 独立 | iPhone Duo/Sheets/Outer - Portrait | `12892:62240` | — | 部分实现 | 示意：`MockScreen` 按设计尺寸画安全区（绿色虚线）、折痕（橙色）、sheet | `LayoutGuides/DuoLayoutGuide.swift` | 真实布局应依赖系统安全区（`.safeAreaInset` / `.safeAreaBar`），折痕位置需 iOS 27.1 `reservedRegions`；本图只是示意 |
| 内部件·族 | _Layout Overlays | `12892:61511` | 3 | 内部件 |  |  |  |

### 令牌页

| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |
|---|---|---|---|---|---|---|---|
| 令牌 | 颜色 | — | — | 已实现 | `Color(hex:alpha:)` 色块 + `LinearGradient` 渐变 | `Tokens/ColorsTokenPage.swift`、`Tokens/ColorSwatch.swift`、`Tokens/GradientSwatch.swift` | tokens/colors.json：hex、alpha、使用次数 |
| 令牌 | 文字样式 | — | — | 已实现 | `.font(.system(size:weight:design:))` + `.tracking` | `Tokens/TypographyTokenPage.swift`、`Tokens/TextStyleRow.swift` | tokens/typography.json；按令牌固定字号渲染（不跟随动态字体），行高只显示数值 |
| 令牌 | 效果与材质 | — | — | 已实现 | `Material` 6 种、`.glassEffect(.regular/.clear/.tint)`、`.shadow(.drop/.inner)`、`.blur` | `Tokens/EffectsTokenPage.swift`、`Tokens/MaterialSamples.swift`、`Tokens/EffectPreview.swift` | tokens/effects.json；spread 只显示数值（SwiftUI 阴影无 spread） |
| 令牌 | 几何 | — | — | 已实现 | `RoundedRectangle` 圆角预览、`Capsule` 间距条、按比例的尺寸框 | `Tokens/GeometryTokenPage.swift`、`Tokens/CornerRadiusSwatch.swift`、`Tokens/SpacingRow.swift`、`Tokens/SizeSwatch.swift` | tokens/geometry.json；圆角预览最大画到 32 |
