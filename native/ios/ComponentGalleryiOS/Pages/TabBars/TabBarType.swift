import Foundation

/// Figma `Type` 轴：Default、Search Role、Prominent Tab。
enum TabBarType: String, CaseIterable, Identifiable {
    case standard = "Default"
    case searchRole = "Search Role"
    case prominentTab = "Prominent Tab"

    var id: Self { self }
}
