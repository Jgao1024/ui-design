import Foundation

nonisolated struct VariantAxis: Decodable, Sendable, Identifiable {
    let name: String
    let values: [String]

    var id: String { name }

    var isAppearance: Bool {
        values.contains("Light") && values.contains("Dark")
    }
}
