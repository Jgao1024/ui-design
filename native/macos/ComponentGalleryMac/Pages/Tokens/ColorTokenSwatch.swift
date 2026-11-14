import SwiftUI

/// 纯色令牌：色块 + hex + alpha + 使用次数。
struct ColorTokenSwatch: View {
    let token: ColorToken

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: 8)
                .fill(token.color)
                .strokeBorder(.separator)
                .frame(height: 44)
            Text(token.hex)
                .font(.callout.monospaced())
                .textSelection(.enabled)
            Text("alpha \(token.alpha.formatted()) · \(token.uses) 次")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}
