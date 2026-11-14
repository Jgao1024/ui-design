import Foundation

struct DemoTabItem: Identifiable {
    let id: Int
    let title: LocalizedStringResource
    let systemImage: String

    static let all = [
        DemoTabItem(id: 0, title: "主页", systemImage: "house"),
        DemoTabItem(id: 1, title: "浏览", systemImage: "square.grid.2x2"),
        DemoTabItem(id: 2, title: "资料库", systemImage: "books.vertical"),
        DemoTabItem(id: 3, title: "收藏", systemImage: "star"),
        DemoTabItem(id: 4, title: "设置", systemImage: "gear"),
    ]
}
