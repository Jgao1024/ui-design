import Foundation

/// 几何令牌：值（圆角、间距或 "宽x高"）与使用次数。
nonisolated struct CountedValue: Decodable, Sendable {
    let key: String
    let count: Int
}
