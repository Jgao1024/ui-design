import SwiftUI

/// Figma Popover 族的 Edge 取值 → SwiftUI 的 `arrowEdge` + `attachmentAnchor`。
/// 例如「Trailing (Top)」：气泡在按钮右侧，箭头指向按钮右上角。
struct PopoverPlacement: Identifiable {
    let name: String
    let edge: Edge
    let anchor: UnitPoint

    var id: String { name }

    static let all: [PopoverPlacement] = [
        .init(name: "Top (Leading)", edge: .top, anchor: .topLeading),
        .init(name: "Top (Center)", edge: .top, anchor: .top),
        .init(name: "Top (Trailing)", edge: .top, anchor: .topTrailing),
        .init(name: "Bottom (Leading)", edge: .bottom, anchor: .bottomLeading),
        .init(name: "Bottom (Center)", edge: .bottom, anchor: .bottom),
        .init(name: "Bottom (Trailing)", edge: .bottom, anchor: .bottomTrailing),
        .init(name: "Leading (Top)", edge: .leading, anchor: .topLeading),
        .init(name: "Leading (Middle)", edge: .leading, anchor: .leading),
        .init(name: "Leading (Bottom)", edge: .leading, anchor: .bottomLeading),
        .init(name: "Trailing (Top)", edge: .trailing, anchor: .topTrailing),
        .init(name: "Trailing (Middle)", edge: .trailing, anchor: .trailing),
        .init(name: "Trailing (Bottom)", edge: .trailing, anchor: .bottomTrailing),
    ]
}
