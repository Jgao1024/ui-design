import SwiftUI

struct EffectPreview: View {
    let token: EffectToken
    let color: Color

    var body: some View {
        switch token.type {
        case "DROP_SHADOW":
            RoundedRectangle(cornerRadius: 14)
                .fill(.background.shadow(.drop(color: color, radius: token.radius, x: token.x, y: token.y)))
                .padding(12)
        case "INNER_SHADOW":
            RoundedRectangle(cornerRadius: 14)
                .fill(.background.shadow(.inner(color: color, radius: token.radius, x: token.x, y: token.y)))
                .padding(12)
        case "LAYER_BLUR":
            Image(systemName: "photo")
                .font(.largeTitle)
                .blur(radius: token.radius / 4)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                .accessibilityLabel("图层模糊示例")
        case "BACKGROUND_BLUR", "GLASS":
            ZStack {
                ColorfulBackdrop()
                Text("Liquid Glass")
                    .font(.caption)
                    .padding(10)
                    .glassEffect(.regular, in: .capsule)
            }
            .clipShape(.rect(cornerRadius: 14))
        default:
            Text(token.type)
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}
