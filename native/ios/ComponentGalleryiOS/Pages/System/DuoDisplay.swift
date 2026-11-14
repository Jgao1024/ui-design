import Foundation

/// iPhone Duo 显示屏 + 方向，对应 kit 设计尺寸（pt）。
enum DuoDisplay: String {
    case outerPortrait = "Outer Portrait"
    case innerPortrait = "Inner Portrait"
    case innerLandscape = "Inner Landscape"

    var size: (width: Double, height: Double) {
        switch self {
        case .outerPortrait: (466, 678)
        case .innerPortrait: (669, 951)
        case .innerLandscape: (951, 669)
        }
    }

    var columns: Int {
        switch self {
        case .outerPortrait: 4
        case .innerPortrait: 5
        case .innerLandscape: 6
        }
    }
}
