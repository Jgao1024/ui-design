import Foundation

/// registry.json 的根对象，由 `scripts/build-data.py` 生成。
struct Registry: Decodable, Sendable {
    let kit: String
    let categories: [GalleryCategory]
}
