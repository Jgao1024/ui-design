import Foundation

/// tokens/geometry.json 里的「数值 → 使用次数」，例如圆角 `10.0` 用了 1190 次。
struct CountToken: Decodable, Sendable, Identifiable {
    let key: String
    let uses: Int

    var id: String { key }
}
