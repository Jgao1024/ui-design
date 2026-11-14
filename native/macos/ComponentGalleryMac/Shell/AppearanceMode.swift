import SwiftUI

/// 全局明暗开关的取值，存在 `@AppStorage("appearance")`。
enum AppearanceMode: String, CaseIterable, Identifiable {
    case system
    case light
    case dark

    var id: Self { self }

    var title: LocalizedStringResource {
        switch self {
        case .system: "跟随系统"
        case .light: "Light"
        case .dark: "Dark"
        }
    }

    /// `nil` 表示跟随系统。
    var colorScheme: ColorScheme? {
        switch self {
        case .system: nil
        case .light: .light
        case .dark: .dark
        }
    }
}
