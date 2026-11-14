import Foundation

/// Figma `Label Style` 轴 → 系统 LabelStyle。
enum DemoLabelMode: CaseIterable, Identifiable {
    case iconOnly
    case titleOnly
    case titleAndIcon

    var id: Self { self }

    var title: String {
        switch self {
        case .iconOnly: "Icon only"
        case .titleOnly: "Title only"
        case .titleAndIcon: "Title and Icon"
        }
    }
}
