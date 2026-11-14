import Foundation

nonisolated struct TextStyleToken: Decodable, Sendable {
    let family: String
    let weight: Int
    let size: Double
    let lineHeight: Double
    let tracking: Double
    let uses: Int
}
