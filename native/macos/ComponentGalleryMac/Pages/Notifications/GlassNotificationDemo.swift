import SwiftUI

/// Liquid Glass - Notification - Dark / Light 独立组件（自绘）：通知用的玻璃底，强制指定明暗。
struct GlassNotificationDemo: View {
    let colorScheme: ColorScheme

    var body: some View {
        RoundedRectangle(cornerRadius: 18)
            .fill(.clear)
            .frame(width: 100, height: 100)
            .glassEffect(.regular, in: .rect(cornerRadius: 18))
            .padding(24)
            .background { WallpaperBackdrop() }
            .clipShape(.rect(cornerRadius: 12))
            .environment(\.colorScheme, colorScheme)
    }
}
