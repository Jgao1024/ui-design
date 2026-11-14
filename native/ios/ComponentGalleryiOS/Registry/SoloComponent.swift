import Foundation

/// 不属于任何族的独立组件。
nonisolated struct SoloComponent: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    let w: Double
    let h: Double
}
