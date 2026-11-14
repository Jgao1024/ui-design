import SwiftUI

/// tokens/colors.json 里的渐变。
struct GradientToken: Decodable, Sendable {
    let stops: [GradientStop]
    let uses: Int

    var gradient: Gradient {
        Gradient(stops: stops.map { .init(color: Color(hex: $0.hex, opacity: $0.alpha), location: $0.position) })
    }
}
