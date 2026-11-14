import SwiftUI

/// 效果令牌的实物：GLASS → `.glassEffect`，BACKGROUND_BLUR → `Material`，阴影 → `.shadow`，LAYER_BLUR → `.blur`。
/// Figma 的模糊半径约等于 SwiftUI 半径的 2 倍，这里按一半换算。
struct EffectTokenSwatch: View {
    let token: EffectToken

    private var shadowColor: Color {
        Color(hex: token.hex ?? "#000000", opacity: token.alpha)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            ZStack {
                WallpaperBackdrop()
                switch token.type {
                case "GLASS":
                    Color.clear
                        .frame(width: 70, height: 50)
                        .glassEffect(.regular, in: .rect(cornerRadius: 12))
                case "BACKGROUND_BLUR":
                    RoundedRectangle(cornerRadius: 12)
                        .fill(.ultraThinMaterial)
                        .frame(width: 70, height: 50)
                case "DROP_SHADOW":
                    RoundedRectangle(cornerRadius: 12)
                        .fill(.background)
                        .frame(width: 70, height: 50)
                        .shadow(color: shadowColor, radius: token.radius / 2, x: token.offsetX, y: token.offsetY)
                case "INNER_SHADOW":
                    RoundedRectangle(cornerRadius: 12)
                        .fill(.background.shadow(.inner(color: shadowColor, radius: token.radius / 2, x: token.offsetX, y: token.offsetY)))
                        .frame(width: 70, height: 50)
                default:
                    RoundedRectangle(cornerRadius: 12)
                        .fill(.background)
                        .frame(width: 70, height: 50)
                        .blur(radius: token.radius / 2)
                }
            }
            .frame(height: 90)
            .clipShape(.rect(cornerRadius: 10))

            Text(token.type)
                .font(.callout.monospaced())
            Text(summary)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private var summary: String {
        var parts: [String] = []
        if token.radius != 0 {
            parts.append(String(localized: "半径 \(token.radius.formatted())"))
        }
        if token.offsetX != 0 || token.offsetY != 0 {
            parts.append(String(localized: "偏移 \(token.offsetX.formatted()),\(token.offsetY.formatted())"))
        }
        if token.spread != 0 {
            parts.append(String(localized: "扩展 \(token.spread.formatted())"))
        }
        if let hex = token.hex {
            parts.append("\(hex)@\(token.alpha.formatted())")
        }
        parts.append(String(localized: "\(token.uses) 次"))
        return parts.joined(separator: " · ")
    }
}
