import Foundation

/// tokens/*.json 的精简版。
nonisolated struct TokenData: Decodable, Sendable {
    let colors: [ColorToken]
    let gradients: [GradientToken]
    let styles: [TextStyleToken]
    let effects: [EffectToken]
    let cornerRadii: [CountedValue]
    let itemSpacing: [CountedValue]
    let componentSizes: [CountedValue]
}
