import SwiftUI

/// Home Screen Quick Actions：模拟图标 + 真实 `.contextMenu`（系统用同一套菜单外观）。
struct QuickActionsDemo: View {
    var body: some View {
        ZStack {
            SimWallpaper()
            SimAppIcon(systemImage: "camera.fill", tint: .gray, size: 72)
                .contentShape(.contextMenuPreview, .rect(cornerRadius: 16))
                .contextMenu {
                    Button("自拍", systemImage: "person.crop.square") {}
                    Button("录制视频", systemImage: "video") {}
                    Button("拍照", systemImage: "camera") {}
                    Divider()
                    Button("编辑主屏幕", systemImage: "apps.iphone") {}
                    Button("移除 App", systemImage: "minus.circle", role: .destructive) {}
                }
        }
        .frame(height: 200)
        .clipShape(.rect(cornerRadius: 20))
        InteractiveHint(text: "长按图标弹出快捷操作菜单（菜单是真实的 .contextMenu，图标与壁纸为模拟）")
    }
}
