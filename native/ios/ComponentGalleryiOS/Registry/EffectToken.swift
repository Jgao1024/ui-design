import Foundation

/// Figma 效果：DROP_SHADOW、INNER_SHADOW、BACKGROUND_BLUR（Liquid Glass 材质层）、LAYER_BLUR、GLASS。
nonisolated struct EffectToken: Decodable, Sendable {
    let type: String
    let hex: String?
    let alpha: Double
    let x: Double
    let y: Double
    let radius: Double
    let spread: Double
    let uses: Int
}
