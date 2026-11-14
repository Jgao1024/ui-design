import Foundation

nonisolated struct Variant: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    let values: [String]
    let w: Double
    let h: Double
}
