import SwiftUI

/// 尚未实现的族或独立组件的占位卡，保证目录完整。
struct PlaceholderCard: View {
    let reason: LocalizedStringResource

    var body: some View {
        Label {
            Text(reason)
        } icon: {
            Image(systemName: "square.dashed")
        }
        .font(.subheadline)
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity, minHeight: 60)
        .background {
            RoundedRectangle(cornerRadius: 12)
                .strokeBorder(.tertiary, style: StrokeStyle(lineWidth: 1, dash: [4]))
        }
    }
}
