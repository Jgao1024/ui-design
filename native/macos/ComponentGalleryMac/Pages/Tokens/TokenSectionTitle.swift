import SwiftUI

/// 令牌页里的小节标题，例如「纯色 185」。
struct TokenSectionTitle: View {
    let title: LocalizedStringResource
    let count: Int

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.title2)
                .bold()
            Text(count, format: .number)
                .foregroundStyle(.secondary)
        }
        .padding(.top, 8)
    }
}
