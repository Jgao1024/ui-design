import SwiftUI

/// 单个效果令牌的预览：阴影按数值渲染，模糊用材质或 `.blur` 表示。
struct EffectSwatch: View {
    let token: EffectToken

    private var color: Color {
        Color(hex: token.hex ?? "#000000", alpha: token.alpha)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            EffectPreview(token: token, color: color)
                .frame(height: 72)
            Text(token.type)
                .font(.caption.monospaced())
                .bold()
            Text("\(token.hex ?? "—") α\(token.alpha, format: .number) · x\(token.x, format: .number) y\(token.y, format: .number) · r\(token.radius, format: .number) · s\(token.spread, format: .number)")
                .font(.caption2.monospaced())
                .foregroundStyle(.secondary)
            Text("\(token.uses) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}
