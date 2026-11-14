import SwiftUI

/// 登记表第 5 节定义的 SwiftUI 对应级别。
nonisolated enum SupportLevel: String, Decodable, Sendable {
    case native = "原生"
    case bridged = "桥接"
    case partial = "部分"
    case simulated = "自绘"
    case skipped = "不做"

    var tint: Color {
        switch self {
        case .native: .green
        case .bridged: .blue
        case .partial: .orange
        case .simulated: .purple
        case .skipped: .gray
        }
    }
}
