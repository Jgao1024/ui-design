import Foundation

/// 示例窗口的工具栏样式。`.windowToolbarStyle` 只能加在 Scene 上，所以每种样式各有一个 WindowGroup。
enum ToolbarStyleKind: String, Codable, Hashable, CaseIterable, Identifiable {
    case automatic
    case unified
    case unifiedCompact
    case expanded

    var id: Self { self }

    var windowID: String { "demo-window-\(rawValue)" }

    /// Figma「Window Type」里的叫法。
    var figmaName: String {
        switch self {
        case .automatic: "Default"
        case .unified: "Unified Toolbar"
        case .unifiedCompact: "Unified Compact Toolbar"
        case .expanded: "Expanded Toolbar"
        }
    }

    var modifierName: String {
        switch self {
        case .automatic: ".windowToolbarStyle(.automatic)"
        case .unified: ".windowToolbarStyle(.unified)"
        case .unifiedCompact: ".windowToolbarStyle(.unifiedCompact)"
        case .expanded: ".windowToolbarStyle(.expanded)"
        }
    }
}
