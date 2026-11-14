import SwiftUI

/// Sidebar：Floating Window False / True。
struct SidebarDemo: View {
    var body: some View {
        SplitViewSample()
        UnreproducedList(items: [
            "Floating Window: True：iPad 浮动窗口形态由系统决定，在 iPad 上缩小窗口可见",
            "窄屏（iPhone、iPhone Duo 外屏）上 NavigationSplitView 会折叠成单栏",
        ])
    }
}
