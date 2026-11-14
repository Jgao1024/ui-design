import Foundation

nonisolated struct ColorToken: Decodable, Sendable {
    let hex: String
    let alpha: Double
    let uses: Int
}
