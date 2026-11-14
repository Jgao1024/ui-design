#!/usr/bin/env python3
"""页面 → SwiftUI 对应关系（页面级）。被 gen-docs.py 写进登记表文档。

级别含义：
  原生  SwiftUI 公开 API 能直接渲染系统真实外观
  桥接  SwiftUI 没有对应控件，需要 AppKit/UIKit 包装（NSViewRepresentable / UIViewRepresentable）
  部分  一部分能用真实控件，一部分只能自绘
  自绘  由系统进程绘制，App 里拿不到真实控件，只能用 SwiftUI 视图模拟外观
  不做  没有对应 API，也不属于组件展示（如设备外框）

API 名称已在 Xcode 27.2 的 macOS / iOS SDK swiftinterface 里逐个核对存在。
"""

BUTTON = ("原生", "`Button` + `.buttonStyle(.automatic/.bordered/.borderedProminent/.borderless/.plain/.glass/.glassProminent)`、"
          "`.controlSize`、`.buttonBorderShape`、`.tint`、`Button(role: .destructive)`、`.disabled`")

MAP = {
    "macos27": {
        "Colors": ("原生", "`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(nsColor:)`"),
        "Materials": ("原生", "`Material`（`.ultraThinMaterial` 到 `.thickMaterial`、`.bar`）、`.glassEffect(_:in:)`、`GlassEffectContainer`"),
        "Product Bezels": ("不做", "设备外框，无对应 API"),
        "Alerts": ("原生", "`.alert(_:isPresented:actions:message:)`、`.confirmationDialog`（真实弹出，非内联）"),
        "Buttons": BUTTON,
        "Color Wells": ("原生", "`ColorPicker`"),
        "Combo Boxes": ("桥接", "SwiftUI 无组合框，用 `NSComboBox`（`NSViewRepresentable`）"),
        "Dialogs": ("原生", "`.fileImporter`、`.fileExporter`、`.confirmationDialog`"),
        "Disclosure Controls": ("原生", "`DisclosureGroup`"),
        "Forms": ("原生", "`Form`、`.formStyle(.grouped)`、`.formStyle(.columns)`、`LabeledContent`、`Section`"),
        "Group Boxes": ("原生", "`GroupBox`"),
        "Image Wells": ("桥接", "可编辑图片框用 `NSImageView`（`NSViewRepresentable`），拖放用 `.dropDestination`"),
        "Lists and Tables": ("原生", "`List`、`Table`、`.listStyle`、`.alternatingRowBackgrounds()`"),
        "Menu Bar and Dock": ("部分", "菜单栏用 `MenuBarExtra`、`.commands`、`CommandMenu`；Dock 与桌面壁纸无 API，只能自绘"),
        "Menus": ("原生", "`Menu`、`.contextMenu`、`CommandMenu`"),
        "Notifications": ("自绘", "通知横幅由系统绘制（`UNUserNotificationCenter`），只能用 SwiftUI 模拟外观"),
        "Pointers": ("原生", "`.pointerStyle(_:)`"),
        "Pop-up and Pull-down Buttons": ("原生", "`Picker` + `.pickerStyle(.menu)`、`Menu`"),
        "Popovers": ("原生", "`.popover(isPresented:)`"),
        "Progress Indicators": ("原生", "`ProgressView`（线性、圆形、不确定）、`Gauge`"),
        "Scrollbar": ("原生", "`ScrollView`、`.scrollIndicators`；滚动条样式跟随系统设置，不能强制"),
        "Search Fields": ("原生", "`.searchable`、`TextField`"),
        "Sidebars": ("原生", "`NavigationSplitView`、`List` + `.listStyle(.sidebar)`、`.inspector`"),
        "Segmented Controls": ("原生", "`Picker` + `.pickerStyle(.segmented)`"),
        "Sheets": ("原生", "`.sheet(isPresented:)`"),
        "Sliders and Dials": ("部分", "滑块用 `Slider`、`Gauge`；旋钮（Dial）用 `NSSlider` 圆形样式桥接"),
        "Steppers": ("原生", "`Stepper`"),
        "Text Fields": ("原生", "`TextField`、`SecureField`、`TextEditor`、`.textFieldStyle`"),
        "Toolbars": ("原生", "`.toolbar`、`ToolbarItem`、`ToolbarItemGroup`、`.windowToolbarStyle`"),
        "Toggles": ("原生", "`Toggle` + `.toggleStyle(.switch/.checkbox/.button)`"),
        "Tooltips": ("原生", "`.help(_:)`"),
        "Windows": ("原生", "`WindowGroup`、`Window`、`.windowToolbarStyle`、`NavigationSplitView`"),
        "tokens-colors": ("原生", "按 hex 渲染色块，对照系统语义色"),
        "tokens-typography": ("原生", "`Font`、`Font.TextStyle`，字体用系统 SF"),
        "tokens-effects": ("原生", "`Material`、`.glassEffect`、`.shadow`、`.blur`"),
        "tokens-geometry": ("原生", "纯数值展示：圆角、间距、尺寸"),
    },
    "ios27": {
        "Colors": ("原生", "`Color` 语义色（`.primary`、`.secondary`、`Color.accentColor`）、`Color(uiColor:)`"),
        "Materials": ("原生", "`Material`、`.glassEffect(_:in:)`、`GlassEffectContainer`"),
        "Layout Guides": ("原生", "示意用：`.safeAreaInset`、`.safeAreaBar`、`.safeAreaPadding`、`.containerRelativeFrame`"),
        "Product Bezels": ("不做", "设备外框，无对应 API"),
        "System": ("自绘", "主屏幕、锁屏、控制中心、壁纸、Home Indicator 由系统绘制，只能用 SwiftUI 模拟外观"),
        "Action Sheets": ("原生", "`.confirmationDialog`"),
        "Activity Views": ("原生", "`ShareLink`"),
        "Alerts": ("原生", "`.alert(_:isPresented:actions:message:)`"),
        "App Icons": ("自绘", "图标是资源文件，不是控件；用 `Image` 展示静态图或自绘"),
        "Buttons": BUTTON,
        "Color Pickers": ("原生", "`ColorPicker`"),
        "Contextual Menus": ("原生", "`.contextMenu`"),
        "Date and Time Pickers": ("原生", "`DatePicker`（`.compact`、`.graphical`、`.wheel`）"),
        "Empty States": ("原生", "`ContentUnavailableView`"),
        "Face ID": ("自绘", "认证界面由系统绘制（LocalAuthentication），只能自绘示意"),
        "Keyboards": ("部分", "键盘本体由系统绘制，用 `TextField` + `.keyboardType` 触发真实键盘；配件栏用 `ToolbarItemGroup(placement: .keyboard)`"),
        "Lists": ("原生", "`List`、`.listStyle(.insetGrouped/.plain/.grouped)`、`Section`"),
        "Menus": ("原生", "`Menu`"),
        "Notifications": ("自绘", "通知横幅由系统绘制，只能用 SwiftUI 模拟外观"),
        "Page Controls": ("原生", "`TabView` + `.tabViewStyle(.page)`"),
        "Popovers": ("原生", "`.popover(isPresented:)`"),
        "Pop-up Buttons": ("原生", "`Picker` + `.pickerStyle(.menu)`"),
        "Progress Indicators": ("原生", "`ProgressView`、`Gauge`"),
        "Segmented Controls": ("原生", "`Picker` + `.pickerStyle(.segmented)`"),
        "Sheets": ("原生", "`.sheet(isPresented:)` + `.presentationDetents`"),
        "Sidebars": ("原生", "`NavigationSplitView`、`TabView` + `.tabViewStyle(.sidebarAdaptable)`"),
        "Sliders": ("原生", "`Slider`"),
        "Status Bars and Menu Bars": ("自绘", "状态栏由系统绘制，SwiftUI 只能用 `.toolbarVisibility(_:for: .statusBar)` 显隐；其余自绘示意"),
        "Steppers": ("原生", "`Stepper`"),
        "Tab Bars": ("原生", "`TabView` + `Tab`、`.tabBarMinimizeBehavior`"),
        "Text Fields": ("原生", "`TextField`、`SecureField`、`TextEditor`"),
        "Toggles": ("原生", "`Toggle`"),
        "Toolbars": ("原生", "`.toolbar`、`ToolbarItem(placement:)`、`ToolbarSpacer`、`ToolbarOverflowMenu`"),
        "Widgets": ("部分", "WidgetKit 需要独立的 Widget Extension；v1 在 App 内用 SwiftUI 视图模拟小组件外观"),
        "Windows": ("原生", "`WindowGroup`、iPad 多窗口"),
        "tokens-colors": ("原生", "按 hex 渲染色块，对照系统语义色"),
        "tokens-typography": ("原生", "`Font`、`Font.TextStyle`，字体用系统 SF"),
        "tokens-effects": ("原生", "`Material`、`.glassEffect`、`.shadow`、`.blur`"),
        "tokens-geometry": ("原生", "纯数值展示：圆角、间距、尺寸"),
    },
}
