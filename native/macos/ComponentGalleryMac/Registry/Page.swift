import Foundation

/// 一个展示页面：Figma kit 页面，或由 tokens/*.json 生成的令牌页。
struct Page: Decodable, Sendable, Identifiable {
    let slug: String
    let name: String
    /// `kit` 或 `tokens-colors` 等令牌页类型。
    let kind: String
    let category: String
    let categoryLabel: String
    let summary: String?
    let hig: [HIGLink]
    let swiftui: SwiftUIMapping
    let families: [Component]
    let solos: [Component]
    let internals: [InternalPart]
    let tokens: TokenData?

    var id: String { slug }

    var variantCount: Int {
        families.reduce(0) { $0 + $1.variants.count }
    }
}
