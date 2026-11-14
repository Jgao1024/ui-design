import Foundation

/// Figma `Style` 轴 → SwiftUI 按钮样式。
enum DemoButtonKind: CaseIterable, Identifiable {
    case borderless
    case bordered
    case borderedProminent
    case glass
    case glassProminent

    var id: Self { self }

    /// Figma 原值。
    var title: String {
        switch self {
        case .borderless: "Borderless"
        case .bordered: "Bordered"
        case .borderedProminent: "Bordered - Prominent"
        case .glass: "Glass"
        case .glassProminent: "Glass Prominent"
        }
    }
}
