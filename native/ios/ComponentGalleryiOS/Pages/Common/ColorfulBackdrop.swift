import SwiftUI

/// 彩色底图，用来衬托 Liquid Glass 与材质的折射效果（Over-Glass 场景）。
struct ColorfulBackdrop: View {
    var body: some View {
        LinearGradient(
            colors: [.orange, .pink, .purple, .blue, .teal],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
        .overlay {
            Image(systemName: "sparkles")
                .font(.system(size: 120))
                .foregroundStyle(.white.opacity(0.35))
                .accessibilityHidden(true)
        }
    }
}
