import SwiftUI

/// 圆角令牌：按真实半径画 64×64 的圆角矩形（半径超过 32 时就是圆形）。
struct CornerRadiusSwatch: View {
    let token: CountToken

    var body: some View {
        let radius = Double(token.key) ?? 0

        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: min(radius, 32))
                .fill(.tint.opacity(0.25))
                .strokeBorder(.tint)
                .frame(width: 64, height: 64)
            Text("r = \(radius.formatted())")
                .font(.callout.monospaced())
            Text("\(token.uses) 次")
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }
}
