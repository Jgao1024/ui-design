import SwiftUI

/// 打开真实的 `UtilityWindow`（实用工具面板）。
struct OpenUtilityPanelButton: View {
    @Environment(\.openWindow) private var openWindow

    var body: some View {
        Button("打开 Utility Panel", systemImage: "uiwindow.split.2x1", action: open)
    }

    private func open() {
        openWindow(id: UtilityPanelContent.windowID)
    }
}
