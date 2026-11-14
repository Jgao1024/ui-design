import SwiftUI

/// Desktop Template 族（自绘）：壁纸 + 菜单栏 + Dock 组成的整屏模板，按设计尺寸排版后缩放到可用宽度。
struct DesktopTemplateDemo: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        FitWidth(designSize: CGSize(width: 1512, height: 993)) {
            ZStack {
                WallpaperBackdrop()
                VStack {
                    MenuBarMock(isOverDark: colorScheme == .dark)
                    Spacer()
                    DockMock()
                        .scaleEffect(1.6, anchor: .bottom)
                        .padding(.bottom, 12)
                }
            }
        }
    }
}
