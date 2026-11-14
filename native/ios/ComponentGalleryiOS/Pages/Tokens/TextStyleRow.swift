import SwiftUI

struct TextStyleRow: View {
    let token: TextStyleToken

    private var design: Font.Design {
        if token.family.localizedStandardContains("Mono") {
            .monospaced
        } else if token.family.localizedStandardContains("New York") {
            .serif
        } else if token.family.localizedStandardContains("Rounded") {
            .rounded
        } else {
            .default
        }
    }

    /// Figma 数值字重（100–900）映射到 SwiftUI 字重。
    private var weight: Font.Weight {
        switch token.weight {
        case ..<150: .ultraLight
        case ..<250: .thin
        case ..<350: .light
        case ..<450: .regular
        case ..<550: .medium
        case ..<650: .semibold
        case ..<750: .bold
        case ..<850: .heavy
        default: .black
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Aa 文字样式 Text Style")
                .font(.system(size: token.size, weight: weight, design: design))
                .tracking(token.tracking)
                .lineLimit(1)
                .minimumScaleFactor(0.3)
            Text("\(token.family) · \(token.weight) · \(token.size, format: .number)/\(token.lineHeight, format: .number) · 字距 \(token.tracking, format: .number) · \(token.uses) 次")
                .font(.caption.monospaced())
                .foregroundStyle(.secondary)
            Divider()
        }
    }
}
