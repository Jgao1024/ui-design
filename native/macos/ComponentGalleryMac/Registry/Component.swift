import Foundation

/// 公开组件族（有变体）或独立组件（没有变体）。`id` 是 Figma nodeId。
struct Component: Decodable, Sendable, Identifiable {
    let id: String
    let name: String
    let axes: [PropertyAxis]
    let variants: [Variant]
}
