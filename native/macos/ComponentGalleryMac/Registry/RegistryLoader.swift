import Foundation

/// 从 App 包读取并解码 registry.json。
enum RegistryLoader {
    /// 在后台执行读文件和 JSON 解码，不占用主线程。
    @concurrent
    static func load() async throws -> PageIndex {
        guard let url = Bundle.main.url(forResource: "registry", withExtension: "json") else {
            throw RegistryError.missingResource
        }
        let data = try Data(contentsOf: url)
        let registry = try JSONDecoder().decode(Registry.self, from: data)
        // PageIndex 的查找和翻页假定至少有一页。
        guard registry.categories.contains(where: { !$0.pages.isEmpty }) else {
            throw RegistryError.empty
        }
        return PageIndex(registry: registry)
    }
}
