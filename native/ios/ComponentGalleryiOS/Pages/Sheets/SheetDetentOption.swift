import SwiftUI

/// Sheet - iPhone 的 `Detent` 轴。
enum SheetDetentOption: String, CaseIterable, Identifiable {
    case medium = "Medium"
    case large = "Large"
    case largeStacked = "Large (Stacked)"

    var id: Self { self }

    var detents: Set<PresentationDetent> {
        switch self {
        case .medium: [.medium]
        case .large, .largeStacked: [.large]
        }
    }
}
