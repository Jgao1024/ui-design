import SwiftUI

/// Desktop Wallpaper 族（自绘）：用渐变模拟壁纸，随全局明暗切换。
struct DesktopWallpaperDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            FitWidth(designSize: CGSize(width: 1512, height: 982)) {
                WallpaperBackdrop()
            }
            .frame(maxWidth: 520)
            DemoNotes("真实壁纸 —— 桌面壁纸是图片资源，App 没有 API 渲染系统壁纸；这里用渐变模拟")
        }
    }
}
