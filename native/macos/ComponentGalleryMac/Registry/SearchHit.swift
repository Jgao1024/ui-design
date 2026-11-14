import Foundation

/// 搜索结果里的一页；按族名命中时记下命中的族名。
struct SearchHit: Sendable, Identifiable {
    let page: Page
    let matchedFamilies: [String]

    var id: String { page.slug }
}
