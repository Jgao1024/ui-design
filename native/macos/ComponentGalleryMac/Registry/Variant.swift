import Foundation

/// 组件族里的一个变体：各轴取值和 Figma 画板尺寸。
struct Variant: Decodable, Sendable, Identifiable {
    let id: String
    let values: [String: String]
    let w: Double
    let h: Double
}
