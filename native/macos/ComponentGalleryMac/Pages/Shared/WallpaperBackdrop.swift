import SwiftUI

/// 自绘：模拟桌面壁纸的渐变，随明暗模式变化，用来衬托玻璃材质。
struct WallpaperBackdrop: View {
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        LinearGradient(
            colors: colorScheme == .dark
                ? [Color(hex: "#1B2A4A"), Color(hex: "#3B1F4F"), Color(hex: "#0E3B43")]
                : [Color(hex: "#8EC5FC"), Color(hex: "#E0C3FC"), Color(hex: "#FBD3A6")],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
}
