import Foundation

/// Figma Buttons 族的 Style 轴取值。
enum ButtonSample: CaseIterable, Identifiable {
    case bordered
    case tinted
    case destructive
    case prominent
    case prominentDestructive
    case borderless

    var id: Self { self }

    var figmaName: String {
        switch self {
        case .bordered: "Bordered"
        case .tinted: "Bordered - Tinted"
        case .destructive: "Bordered - Destructive"
        case .prominent: "Bordered - Prominent (Default)"
        case .prominentDestructive: "Bordered - Prominent (Default) Destructive"
        case .borderless: "Borderless"
        }
    }

    var code: String {
        switch self {
        case .bordered: ".bordered"
        case .tinted: ".bordered + .tint"
        case .destructive: "role: .destructive + .bordered"
        case .prominent: ".borderedProminent"
        case .prominentDestructive: "role: .destructive + .borderedProminent"
        case .borderless: ".borderless"
        }
    }
}
