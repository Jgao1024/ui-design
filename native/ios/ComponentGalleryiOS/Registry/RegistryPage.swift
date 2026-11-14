import Foundation

/// 一个 Figma 页面或令牌页。
nonisolated struct RegistryPage: Decodable, Sendable, Identifiable {
    let slug: String
    let name: String
    let cat: String
    let catLabel: String
    let kind: PageKind
    let hig: [URL]
    let level: SupportLevel
    let apis: String
    let sets: [ComponentSet]
    let solo: [SoloComponent]
    let `internal`: [InternalPart]

    var id: String { slug }

    var variantCount: Int {
        sets.reduce(0) { $0 + $1.variants }
    }

    /// 搜索范围：页面名与公开族名（内部件不参与）。
    func matches(_ query: String) -> Bool {
        query.isEmpty
            || name.localizedStandardContains(query)
            || sets.contains { $0.name.localizedStandardContains(query) }
    }
}
