import SwiftUI

/// 间距令牌：两个色块之间留出真实的间距。
struct SpacingSwatch: View {
    let token: CountToken

    var body: some View {
        let spacing = Double(token.key) ?? 0

        HStack(spacing: 16) {
            HStack(spacing: max(spacing, 0)) {
                RoundedRectangle(cornerRadius: 3)
                    .fill(.tint)
                    .frame(width: 20, height: 20)
                RoundedRectangle(cornerRadius: 3)
                    .fill(.tint)
                    .frame(width: 20, height: 20)
            }
            .frame(minWidth: 80, alignment: .leading)
            Text("\(spacing.formatted()) pt · \(token.uses) 次")
                .font(.callout.monospaced())
        }
    }
}
