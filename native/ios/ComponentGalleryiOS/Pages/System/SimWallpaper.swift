import SwiftUI

/// 模拟系统壁纸。`isDark` 为 nil 时跟随当前明暗模式。
struct SimWallpaper: View {
    var isDark: Bool?

    @Environment(\.colorScheme) private var colorScheme

    private var dark: Bool {
        isDark ?? (colorScheme == .dark)
    }

    var body: some View {
        LinearGradient(
            colors: dark
                ? [Color(hex: "#0B1A3A"), Color(hex: "#3A1C5C"), Color(hex: "#05060F")]
                : [Color(hex: "#9FD3FF"), Color(hex: "#F7C6E0"), Color(hex: "#FFF1D6")],
            startPoint: .top,
            endPoint: .bottom
        )
        .accessibilityHidden(true)
    }
}
