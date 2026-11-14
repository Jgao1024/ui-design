import SwiftUI

/// BG 族：侧边栏背景。只有 NavigationSplitView 的侧边栏列才有系统材质背景。
struct SidebarBackgroundDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 16) {
                VariantCell("Active: True") {
                    OpenDemoWindowButton(config: WindowDemoConfig(style: .unified))
                }
                Text("打开两个示例窗口：前台窗口是 Active: True，后台窗口的侧边栏背景即 Active: False。")
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
            DemoNotes("页内展示 —— 侧边栏材质由窗口的分栏视图绘制，单独的视图拿不到，只能在示例窗口里看")
        }
    }
}
