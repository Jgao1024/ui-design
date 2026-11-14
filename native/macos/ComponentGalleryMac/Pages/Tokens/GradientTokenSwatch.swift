import SwiftUI

/// 渐变令牌：横向渐变条 + 色标 + 使用次数。
struct GradientTokenSwatch: View {
    let token: GradientToken

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: 8)
                .fill(LinearGradient(gradient: token.gradient, startPoint: .leading, endPoint: .trailing))
                .strokeBorder(.separator)
                .frame(height: 44)
            Text(token.stops.map { "\($0.hex)@\($0.alpha.formatted())" }.joined(separator: " → "))
                .font(.caption.monospaced())
                .lineLimit(2)
            Text("\(token.uses) 次")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}
