import Foundation

/// 以 `_` 开头的内部件，只列名字，不做演示，也不参与搜索。
struct InternalPart: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    /// 内部件族的变体数；内部独立组件为 0。
    let variants: Int
}
