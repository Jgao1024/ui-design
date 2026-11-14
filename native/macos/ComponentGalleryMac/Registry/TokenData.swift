import Foundation

/// 令牌页的数据；四个令牌页各自只填其中一部分字段。
struct TokenData: Decodable, Sendable {
    let colors: [ColorToken]?
    let gradients: [GradientToken]?
    let styles: [TextStyleToken]?
    let effects: [EffectToken]?
    let cornerRadii: [CountToken]?
    let itemSpacing: [CountToken]?
    let componentSizes: [CountToken]?
}
