import SwiftUI

/// 模拟主屏幕用的一组图标样式。
enum SimIcons {
    static let symbols: [(String, Color)] = [
        ("message.fill", .green), ("phone.fill", .green), ("safari.fill", .blue), ("music.note", .pink),
        ("camera.fill", .gray), ("photo.fill", .orange), ("calendar", .red), ("clock.fill", .black),
        ("map.fill", .teal), ("cloud.sun.fill", .cyan), ("envelope.fill", .blue), ("note.text", .yellow),
        ("gearshape.fill", .gray), ("heart.fill", .pink), ("book.fill", .orange), ("bag.fill", .indigo),
        ("gamecontroller.fill", .purple), ("tv.fill", .black), ("wallet.pass.fill", .black), ("star.fill", .yellow),
        ("mic.fill", .red), ("folder.fill", .blue), ("figure.run", .green), ("house.fill", .orange),
    ]

    static func icon(at index: Int) -> (systemImage: String, tint: Color) {
        let item = symbols[index % symbols.count]
        return (item.0, item.1)
    }
}
