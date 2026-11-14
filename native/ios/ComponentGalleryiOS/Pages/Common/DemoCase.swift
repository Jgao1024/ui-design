import SwiftUI

/// 一个变体（或一组轴值）的演示：上方灰色小标题，下方真实控件。
struct DemoCase<Content: View>: View {
    let title: LocalizedStringResource
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.caption)
                .foregroundStyle(.secondary)
            content
        }
    }
}
