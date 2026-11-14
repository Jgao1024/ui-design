import SwiftUI

/// Figma `Edge` 轴：箭头所在边 + 沿该边的位置。
enum PopoverEdge: String, CaseIterable, Identifiable {
    case bottomLeading = "Bottom (Leading)"
    case bottomCenter = "Bottom (Center)"
    case bottomTrailing = "Bottom (Trailing)"
    case trailingTop = "Trailing (Top)"
    case trailingMiddle = "Trailing (Middle)"
    case trailingBottom = "Trailing (Bottom)"
    case leadingTop = "Leading (Top)"
    case leadingMiddle = "Leading (Middle)"
    case leadingBottom = "Leading (Bottom)"
    case topLeading = "Top (Leading)"
    case topCenter = "Top (Center)"
    case topTrailing = "Top (Trailing)"

    var id: Self { self }

    /// 传给 `.popover(arrowEdge:)` 的边（SwiftUI 语义：箭头位于锚点的哪条边）。
    var arrowEdge: Edge {
        switch self {
        case .bottomLeading, .bottomCenter, .bottomTrailing: .bottom
        case .trailingTop, .trailingMiddle, .trailingBottom: .trailing
        case .leadingTop, .leadingMiddle, .leadingBottom: .leading
        case .topLeading, .topCenter, .topTrailing: .top
        }
    }

    /// 按钮在演示区里的位置，决定箭头沿边的偏移。
    var anchorAlignment: Alignment {
        switch self {
        case .topLeading: .topLeading
        case .topCenter: .top
        case .topTrailing: .topTrailing
        case .bottomLeading: .bottomLeading
        case .bottomCenter: .bottom
        case .bottomTrailing: .bottomTrailing
        case .leadingTop: .topLeading
        case .leadingMiddle: .leading
        case .leadingBottom: .bottomLeading
        case .trailingTop: .topTrailing
        case .trailingMiddle: .trailing
        case .trailingBottom: .bottomTrailing
        }
    }
}
