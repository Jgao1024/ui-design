import SwiftUI

/// Context: Over-Glass —— 把控件放在 Liquid Glass 上，下面垫一层彩色背景让玻璃效果可见。
struct OverGlassBackdrop<Content: View>: View {
    @ContentBuilder let content: Content

    var body: some View {
        content
            .padding(14)
            .glassEffect(.regular, in: .rect(cornerRadius: 16))
            .padding(14)
            .background(
                LinearGradient(colors: [.orange, .pink, .purple, .blue], startPoint: .topLeading, endPoint: .bottomTrailing),
                in: .rect(cornerRadius: 20)
            )
    }
}
