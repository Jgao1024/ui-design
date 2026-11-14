import Foundation

/// tokens/effects.json 里的效果：GLASS、BACKGROUND_BLUR、DROP_SHADOW、INNER_SHADOW 等。
struct EffectToken: Decodable, Sendable {
    let type: String
    let radius: Double
    let offsetX: Double
    let offsetY: Double
    let spread: Double
    let hex: String?
    let alpha: Double
    let uses: Int
}
