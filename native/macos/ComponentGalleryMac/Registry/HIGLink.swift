import Foundation

/// 页面对应的 HIG 文章。
struct HIGLink: Decodable, Sendable, Identifiable {
    let slug: String
    let url: URL

    var id: String { slug }
}
