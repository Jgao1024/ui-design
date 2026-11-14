import SwiftUI

/// tokens/colors.json 里的纯色。
struct ColorToken: Decodable, Sendable, Identifiable {
    let hex: String
    let alpha: Double
    let uses: Int

    var id: String { "\(hex)@\(alpha)" }

    var color: Color { Color(hex: hex, opacity: alpha) }
}
