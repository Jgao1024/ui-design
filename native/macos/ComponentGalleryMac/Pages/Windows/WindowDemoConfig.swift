import Foundation

/// 打开示例窗口时传入的配置，对应 Figma「Windows - Composed」的 Window Type。
struct WindowDemoConfig: Codable, Hashable, Identifiable {
    var style: ToolbarStyleKind
    var showsTitle = true
    var showsSidebar = true

    var id: String { "\(style.rawValue)-\(showsTitle)-\(showsSidebar)" }

    /// Figma 的 12 种 Window Type，顺序与 kit 一致。
    static let figmaTypes: [WindowDemoConfig] = [
        .init(style: .expanded), .init(style: .unifiedCompact), .init(style: .unified), .init(style: .automatic),
        .init(style: .expanded, showsTitle: false), .init(style: .unifiedCompact, showsTitle: false),
        .init(style: .unified, showsTitle: false), .init(style: .automatic, showsTitle: false),
        .init(style: .expanded, showsSidebar: false), .init(style: .unifiedCompact, showsSidebar: false),
        .init(style: .unified, showsSidebar: false), .init(style: .automatic, showsSidebar: false),
    ]

    var figmaName: String {
        let base = style == .automatic ? "Default" : style.figmaName
        return switch (showsTitle, showsSidebar) {
        case (true, true): "\(base) + Title + Sidebar"
        case (false, _): "\(base) without Title"
        case (true, false): "\(base) + Title"
        }
    }
}
