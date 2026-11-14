import Foundation

/// 按登记表顺序排好的页面目录，负责查找、翻页和搜索。
struct PageIndex: Sendable {
    let categories: [GalleryCategory]
    /// 全部页面，顺序与登记表一致。
    let pages: [Page]
    private let positions: [String: Int]

    init(registry: Registry) {
        categories = registry.categories
        pages = registry.categories.flatMap(\.pages)
        positions = Dictionary(uniqueKeysWithValues: pages.enumerated().map { ($0.element.slug, $0.offset) })
    }

    /// 找不到时回到第一页（例如上次记住的页面已被删除）。
    func page(slug: String) -> Page {
        positions[slug].map { pages[$0] } ?? pages[0]
    }

    /// 上一页或下一页，首尾循环。
    func neighbor(of slug: String, offset: Int) -> Page {
        let current = positions[slug] ?? 0
        let next = (current + offset % pages.count + pages.count) % pages.count
        return pages[next]
    }

    /// 按页面名和公开族名过滤；内部件不参与搜索。空查询返回全部分类。
    func search(_ query: String) -> [SearchSection] {
        let trimmed = query.trimmingCharacters(in: .whitespaces)
        return categories.compactMap { category in
            let hits = category.pages.compactMap { page -> SearchHit? in
                if trimmed.isEmpty || page.name.localizedStandardContains(trimmed) {
                    return SearchHit(page: page, matchedFamilies: [])
                }
                let families = page.families.map(\.name).filter { $0.localizedStandardContains(trimmed) }
                return families.isEmpty ? nil : SearchHit(page: page, matchedFamilies: families)
            }
            return hits.isEmpty ? nil : SearchSection(category: category, hits: hits)
        }
    }
}
