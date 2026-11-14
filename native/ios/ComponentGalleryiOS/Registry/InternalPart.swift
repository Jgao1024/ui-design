import Foundation

/// 以 `_` 开头的内部件。`variants` 为 0 表示内部独立组件。
nonisolated struct InternalPart: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    let variants: Int
}
