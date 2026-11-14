import SwiftUI

/// 每种底部工具栏类型的真实配置。外层用 `.id(type)` 重建，所以这里按类型分支是安全的。
struct BottomToolbarSample: View {
    let type: BottomBarType

    @State private var query = ""
    @FocusState private var isSearchFocused: Bool

    var body: some View {
        switch type {
        case .buttons:
            SampleRows()
                .toolbar {
                    ToolbarItem(placement: .bottomBar) {
                        Button("编辑", systemImage: "pencil") {}
                    }
                    ToolbarSpacer(.flexible, placement: .bottomBar)
                    ToolbarItemGroup(placement: .bottomBar) {
                        Button("分享", systemImage: "square.and.arrow.up") {}
                        Button("删除", systemImage: "trash") {}
                    }
                }
        case .buttonsPageDots:
            SampleRows()
                .toolbar {
                    ToolbarItem(placement: .bottomBar) {
                        Button("上一页", systemImage: "chevron.backward") {}
                    }
                    ToolbarItem(placement: .status) {
                        PageDots(count: 4, current: 1)
                    }
                    ToolbarItem(placement: .bottomBar) {
                        Button("下一页", systemImage: "chevron.forward") {}
                    }
                }
        case .search:
            SampleRows()
                .searchable(text: $query)
                .toolbar {
                    DefaultToolbarItem(kind: .search, placement: .bottomBar)
                }
        case .searchLeading:
            SampleRows()
                .searchable(text: $query)
                .toolbar {
                    ToolbarItem(placement: .bottomBar) {
                        Button("筛选", systemImage: "line.3.horizontal.decrease") {}
                    }
                    DefaultToolbarItem(kind: .search, placement: .bottomBar)
                }
        case .searchTrailing:
            SampleRows()
                .searchable(text: $query)
                .toolbar {
                    DefaultToolbarItem(kind: .search, placement: .bottomBar)
                    ToolbarItem(placement: .bottomBar) {
                        Button("新建", systemImage: "square.and.pencil") {}
                    }
                }
        case .searchFocus:
            SampleRows()
                .searchable(text: $query)
                .searchFocused($isSearchFocused)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("聚焦搜索", systemImage: "magnifyingglass", action: focusSearch)
                    }
                    DefaultToolbarItem(kind: .search, placement: .bottomBar)
                }
        }
    }

    private func focusSearch() {
        isSearchFocused = true
    }
}
