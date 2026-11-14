import Foundation

/// 切换面板里的一个分类分组。
struct PageGroup: Identifiable {
    let category: RegistryCategory
    let pages: [RegistryPage]

    var id: String { category.id }
}
