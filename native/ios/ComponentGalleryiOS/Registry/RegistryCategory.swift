import Foundation

nonisolated struct RegistryCategory: Decodable, Sendable, Identifiable {
    let id: String
    let label: String
}
