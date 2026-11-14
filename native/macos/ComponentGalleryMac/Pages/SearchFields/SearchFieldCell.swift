import Foundation

/// 搜索框网格里可获得焦点的单元格。
enum SearchFieldCell: Hashable {
    case idleEmpty
    case idleText
    case focusedEmpty
    case focusedText
}
