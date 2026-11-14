import SwiftUI

/// 真实 TabView：标签数、类型、滚动最小化都可调。
struct TabBarSample: View {
    var isSidebarAdaptable = false

    @State private var tabCount = 4
    @State private var type = TabBarType.standard
    @State private var minimizesOnScroll = true
    @State private var selection = DemoTabValue.page(0)

    var body: some View {
        Stepper("Tabs: \(tabCount)", value: $tabCount, in: 2...5)
        Picker("Type", selection: $type) {
            ForEach(TabBarType.allCases) { Text($0.rawValue).tag($0) }
        }
        .pickerStyle(.segmented)
        Toggle("Minimized：向下滚动时最小化", isOn: $minimizesOnScroll)

        TabBarCanvas(
            tabCount: tabCount,
            type: type,
            minimizesOnScroll: minimizesOnScroll,
            isSidebarAdaptable: isSidebarAdaptable,
            selection: $selection
        )
        .id("\(tabCount)-\(type.rawValue)-\(isSidebarAdaptable)")
        .frame(height: 420)
        .clipShape(.rect(cornerRadius: 16))
        InteractiveHint(text: "Minimized: True：在演示区里向下滚动列表，标签栏会收起")
    }
}
