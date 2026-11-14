import SwiftUI

/// 在支持多窗口的设备（iPad、iPhone Duo 内屏）上打开一个新窗口。
struct NewWindowButton: View {
    @Environment(\.openWindow) private var openWindow
    @Environment(\.supportsMultipleWindows) private var supportsMultipleWindows

    var body: some View {
        Button("打开新窗口", systemImage: "macwindow.badge.plus", action: open)
            .buttonStyle(.bordered)
            .disabled(supportsMultipleWindows == false)
        if supportsMultipleWindows == false {
            Text("当前设备不支持多窗口，请在 iPad 模拟器上查看。")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private func open() {
        openWindow(id: AppScene.mainWindowID)
    }
}
