import Foundation

/// Toolbar - Bottom - iPhone 的 `Type` 轴。
enum BottomBarType: String, CaseIterable, Identifiable {
    case buttons = "Buttons"
    case buttonsPageDots = "Buttons + Page Dots"
    case search = "Search"
    case searchLeading = "Search + Leading Item"
    case searchTrailing = "Search + Trailing Item"
    case searchFocus = "Search with Focus"

    var id: Self { self }
}
