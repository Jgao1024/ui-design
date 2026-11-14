import Foundation

/// 渐变的一个色标。
struct GradientStop: Decodable, Sendable {
    let hex: String
    let alpha: Double
    let position: Double
}
