import Foundation

nonisolated struct GradientToken: Decodable, Sendable {
    let stops: [GradientStop]
    let uses: Int
}
