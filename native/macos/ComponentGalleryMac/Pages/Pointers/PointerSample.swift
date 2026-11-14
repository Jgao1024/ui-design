import SwiftUI

/// Figma Pointers 族的 21 种 Type → `PointerStyle`；`nil` 表示没有公开 API。
struct PointerSample: Identifiable {
    let name: String
    let style: PointerStyle?
    let code: String

    var id: String { name }

    static let all: [PointerSample] = [
        .init(name: "Default", style: .default, code: ".default"),
        .init(name: "Text Cursor", style: .horizontalText, code: ".horizontalText"),
        .init(name: "Hand (Pointing)", style: .link, code: ".link"),
        .init(name: "Hand (Open)", style: .grabIdle, code: ".grabIdle"),
        .init(name: "Hand (Grabbing)", style: .grabActive, code: ".grabActive"),
        .init(name: "Cross", style: .rectSelection, code: ".rectSelection"),
        .init(name: "Zoom In", style: .zoomIn, code: ".zoomIn"),
        .init(name: "Zoom Out", style: .zoomOut, code: ".zoomOut"),
        .init(name: "Resize (Left-Right)", style: .columnResize, code: ".columnResize"),
        .init(name: "Resize (Left)", style: .columnResize(directions: .leading), code: ".columnResize(directions: .leading)"),
        .init(name: "Resize (Right)", style: .columnResize(directions: .trailing), code: ".columnResize(directions: .trailing)"),
        .init(name: "Resize (Up-Down)", style: .rowResize, code: ".rowResize"),
        .init(name: "Resize (Up)", style: .rowResize(directions: .up), code: ".rowResize(directions: .up)"),
        .init(name: "Resize (Down)", style: .rowResize(directions: .down), code: ".rowResize(directions: .down)"),
        .init(name: "Resize North-South", style: .frameResize(position: .top), code: ".frameResize(position: .top)"),
        .init(name: "Resize West-East", style: .frameResize(position: .trailing), code: ".frameResize(position: .trailing)"),
        .init(name: "Resize North-East South-West", style: .frameResize(position: .topTrailing), code: ".frameResize(position: .topTrailing)"),
        .init(name: "Resize North-West South-East", style: .frameResize(position: .topLeading), code: ".frameResize(position: .topLeading)"),
        .init(name: "Move", style: nil, code: "无公开 API"),
        .init(name: "Beachball", style: nil, code: "系统忙碌时自动出现，无 API"),
        .init(name: "Default with Menu Badge", style: nil, code: "无公开 API"),
    ]
}
