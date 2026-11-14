import SwiftUI

/// 文字样式令牌：用系统字体按令牌的字号、字重、字距、行高真实渲染样例。
struct TextStyleRow: View {
    let token: TextStyleToken

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // 令牌页需要展示精确字号，所以这里直接用固定字号。
            Text("敏捷的棕色狐狸 The quick brown fox 0123")
                .font(.system(size: token.size, weight: token.fontWeight, design: token.fontDesign))
                .tracking(token.letterSpacing)
                .frame(minHeight: token.lineHeight, alignment: .leading)
                .lineLimit(1)
            Text("\(token.family) · 字重 \(token.weight.formatted()) · \(token.size.formatted())/\(token.lineHeight.formatted()) · 字距 \(token.letterSpacing.formatted()) · \(token.uses) 次")
                .font(.caption.monospaced())
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
