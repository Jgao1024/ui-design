import SwiftUI

/// Item 族：Size（列）× Level / State（列表里的行）× Active。
struct SidebarItemDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ActiveComparison {
                HStack(alignment: .top, spacing: 16) {
                    ForEach(SidebarSizes.all, id: \.name) { entry in
                        VariantCell("Size: \(entry.name)") {
                            SidebarLevelsList(size: entry.size)
                        }
                    }
                }
            }
            DemoNotes("侧边栏材质背景 —— 只在 NavigationSplitView 的侧边栏列里出现；页内列表是同款 .sidebar 样式，背景为普通内容背景，完整外观见示例窗口")
        }
    }
}
