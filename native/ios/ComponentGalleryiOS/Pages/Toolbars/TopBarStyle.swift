import SwiftUI

/// Figma 顶部工具栏 `Style` 轴 → 标题显示模式 + 是否带副标题。
enum TopBarStyle: String, CaseIterable, Identifiable {
    case standard = "Default / Title"
    case largeTitle = "Large Title"
    case compactLarge = "Compact Large"
    case twoLine = "Title 2 Line"
    case twoLineLeft = "Title 2 Line Left"

    var id: Self { self }

    var displayMode: ToolbarTitleDisplayMode {
        switch self {
        case .standard, .twoLine: .inline
        case .largeTitle: .large
        case .compactLarge, .twoLineLeft: .inlineLarge
        }
    }

    var hasSubtitle: Bool {
        self == .twoLine || self == .twoLineLeft
    }
}
