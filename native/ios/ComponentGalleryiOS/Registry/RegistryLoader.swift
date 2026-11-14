import Foundation

/// 从 App 包里读取并解码 registry.json，解码在并发线程池执行，不占主线程。
nonisolated enum RegistryLoader {
    @concurrent
    static func load() async throws -> Registry {
        guard let url = Bundle.main.url(forResource: "registry", withExtension: "json") else {
            throw RegistryError.missingResource
        }
        let data = try Data(contentsOf: url)
        return try JSONDecoder().decode(Registry.self, from: data)
    }
}
