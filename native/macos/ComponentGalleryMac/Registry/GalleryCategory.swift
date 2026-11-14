import Foundation

/// 登记表里的一个分类，例如 `03-controls 控件`。
struct GalleryCategory: Decodable, Sendable, Identifiable {
    let id: String
    let label: String
    let pages: [Page]
}
