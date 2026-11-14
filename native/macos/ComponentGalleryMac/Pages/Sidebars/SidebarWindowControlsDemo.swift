import SwiftUI

/// Window Controls 族（侧边栏顶部的红绿灯 + 侧边栏按钮）：属于窗口本身，打开示例窗口查看。
struct SidebarWindowControlsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 16) {
                VariantCell("Toolbar Style: Default") {
                    OpenDemoWindowButton(config: WindowDemoConfig(style: .unified))
                }
                VariantCell("Toolbar Style: Compact") {
                    OpenDemoWindowButton(config: WindowDemoConfig(style: .unifiedCompact))
                }
            }
            Text("红绿灯和侧边栏按钮由窗口绘制，不能单独放进页面；两种工具栏样式分别对应 `.windowToolbarStyle(.unified)` 和 `.unifiedCompact`。")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }
}
