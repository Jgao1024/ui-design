import Foundation

nonisolated struct GradientStop: Decodable, Sendable {
    let hex: String
    let alpha: Double
    let position: Double
}
