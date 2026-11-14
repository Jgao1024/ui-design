import SwiftUI

/// 打开一个指定工具栏样式、标题和侧边栏组合的真实示例窗口。
struct OpenDemoWindowButton: View {
    let config: WindowDemoConfig

    @Environment(\.openWindow) private var openWindow

    var body: some View {
        Button(config.figmaName, systemImage: "macwindow", action: open)
    }

    private func open() {
        openWindow(id: config.style.windowID, value: config)
    }
}
