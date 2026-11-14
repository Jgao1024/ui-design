import SwiftUI

/// Figma `Size` 轴 → `.controlSize`。
enum DemoButtonSize: CaseIterable, Identifiable {
    case large
    case medium
    case small

    var id: Self { self }

    var title: String {
        switch self {
        case .large: "Large"
        case .medium: "Medium"
        case .small: "Small"
        }
    }

    var controlSize: ControlSize {
        switch self {
        case .large: .large
        case .medium: .regular
        case .small: .small
        }
    }
}
