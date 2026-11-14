import Foundation

enum RegistryError: LocalizedError {
    case missingResource
    case empty

    var errorDescription: String? {
        switch self {
        case .missingResource:
            String(localized: "App 包里没有 registry.json。请先运行 native/macos/scripts/build-data.py，再重新生成工程并构建。")
        case .empty:
            String(localized: "registry.json 里没有任何页面。请重新运行 native/macos/scripts/build-data.py。")
        }
    }
}
