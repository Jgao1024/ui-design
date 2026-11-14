import Foundation

/// registry.json 的根：分类、页面（含令牌页）与令牌数据。由 scripts/build-data.py 生成。
nonisolated struct Registry: Decodable, Sendable {
    let categories: [RegistryCategory]
    let pages: [RegistryPage]
    let tokens: TokenData

    func page(slug: String) -> RegistryPage? {
        pages.first { $0.slug == slug }
    }

    func pages(in category: RegistryCategory) -> [RegistryPage] {
        pages.filter { $0.cat == category.id }
    }

    /// 按登记表顺序取相邻页面，首尾循环。
    func page(_ slug: String, offset: Int) -> RegistryPage? {
        guard let index = pages.firstIndex(where: { $0.slug == slug }) else {
            return pages.first
        }
        let count = pages.count
        return pages[((index + offset) % count + count) % count]
    }
}
