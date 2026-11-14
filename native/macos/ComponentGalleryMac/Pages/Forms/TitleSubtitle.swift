import SwiftUI

/// 表单行左侧的标题 + 副标题。
struct TitleSubtitle: View {
    var title: LocalizedStringResource = "Title"
    var subtitle: LocalizedStringResource = "Subtitle"

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title)
            Text(subtitle)
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }
}
