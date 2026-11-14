import SwiftUI

/// Dock 图标：用 `NSWorkspace` 取真实的 App 图标（本页级别为「部分」，允许 AppKit）；运行中的 App 下方有小圆点。
struct DockIcon: View {
    let path: String
    var isRunning = false

    var body: some View {
        VStack(spacing: 3) {
            Image(nsImage: NSWorkspace.shared.icon(forFile: path))
                .resizable()
                .frame(width: 48, height: 48)
                .accessibilityLabel(FileManager.default.displayName(atPath: path))
            Circle()
                .fill(.primary)
                .frame(width: 4, height: 4)
                .opacity(isRunning ? 0.8 : 0)
        }
    }
}
