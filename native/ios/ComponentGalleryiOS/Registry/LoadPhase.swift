import Foundation

nonisolated enum LoadPhase: Sendable {
    case loading
    case loaded(Registry)
    case failed(String)
}
