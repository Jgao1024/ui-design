import Foundation

/// 公开组件族（Figma COMPONENT_SET）。
nonisolated struct ComponentSet: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    let variants: Int
    let axes: [VariantAxis]
    let kids: [Variant]

    /// 同时含 Light 和 Dark 的轴由全局明暗开关控制。
    var appearanceAxis: VariantAxis? {
        axes.first(where: \.isAppearance)
    }

    var axesSummary: String {
        axes.map { "\($0.name): \($0.values.formatted(.list(type: .and, width: .narrow)))" }
            .joined(separator: " · ")
    }
}
