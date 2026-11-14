import SwiftUI

/// 变体单元格：真实控件 + 下方的轴值标签。
struct VariantCell<Content: View>: View {
    let label: String
    let content: Content

    init(_ label: String, @ContentBuilder content: () -> Content) {
        self.label = label
        self.content = content()
    }

    var body: some View {
        VStack(spacing: 6) {
            content
            Text(label)
                .font(.caption)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
        }
    }
}
