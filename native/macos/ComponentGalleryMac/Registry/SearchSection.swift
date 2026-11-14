import Foundation

/// 搜索结果里的一个分类分组。
struct SearchSection: Sendable, Identifiable {
    let category: GalleryCategory
    let hits: [SearchHit]

    var id: String { category.id }
}
