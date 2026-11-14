import SwiftUI

/// Dock 族（自绘）：Dock 由系统进程绘制，没有 API；图标是真实的 App 图标。
struct DockDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            DockMock()
                .padding(24)
                .frame(maxWidth: .infinity)
                .background { WallpaperBackdrop() }
                .clipShape(.rect(cornerRadius: 12))
            DemoNotes("真实控件 —— Dock 由系统进程绘制，App 没有 API；这里是自绘模拟，图标通过 NSWorkspace 取真实 App 图标")
        }
    }
}
