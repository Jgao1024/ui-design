import SwiftUI

struct TabBarCanvas: View {
    let tabCount: Int
    let type: TabBarType
    let minimizesOnScroll: Bool
    let isSidebarAdaptable: Bool
    @Binding var selection: DemoTabValue

    var body: some View {
        // isSidebarAdaptable 对每个实例固定不变，这里的分支不会在运行时来回切换。
        if isSidebarAdaptable {
            tabs.tabViewStyle(.sidebarAdaptable)
        } else {
            tabs
        }
    }

    private var tabs: some View {
        TabView(selection: $selection) {
            ForEach(DemoTabItem.all.prefix(tabCount)) { item in
                Tab(item.title, systemImage: item.systemImage, value: DemoTabValue.page(item.id)) {
                    DemoTabContent(title: item.title)
                }
            }
            if type == .searchRole {
                Tab(value: DemoTabValue.search, role: .search) {
                    DemoTabContent(title: "搜索")
                }
            }
            if type == .prominentTab {
                Tab("新建", systemImage: "plus", value: DemoTabValue.prominent, role: .prominent) {
                    DemoTabContent(title: "新建")
                }
            }
        }
        .tabBarMinimizeBehavior(minimizesOnScroll ? .onScrollDown : .never)
    }
}
