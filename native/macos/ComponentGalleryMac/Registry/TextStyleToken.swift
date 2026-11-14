import SwiftUI

/// tokens/typography.json 里的文字样式。
struct TextStyleToken: Decodable, Sendable, Identifiable {
    let family: String
    let weight: Double
    let size: Double
    let lineHeight: Double
    let letterSpacing: Double
    let uses: Int

    var id: String { "\(family)/\(weight)/\(size)/\(lineHeight)/\(letterSpacing)" }

    /// Figma 数值字重（100–900，含 510、590 这类 SF 中间值）→ 最接近的 `Font.Weight`。
    var fontWeight: Font.Weight {
        switch weight {
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

    /// SF Pro / SF Compact / SF Mono 等都映射到系统字体的对应设计。
    var fontDesign: Font.Design {
        if family.contains("Mono") {
            .monospaced
        } else if family.contains("Rounded") {
            .rounded
        } else if family.contains("New York") {
            .serif
        } else {
            .default
        }
    }
}
