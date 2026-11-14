import Foundation

nonisolated enum RegistryError: LocalizedError {
    case missingResource

    var errorDescription: String? {
        switch self {
        case .missingResource:
            String(localized: "App 包里没有 registry.json，请先运行 native/ios/scripts/build-data.py")
        }
    }
}
