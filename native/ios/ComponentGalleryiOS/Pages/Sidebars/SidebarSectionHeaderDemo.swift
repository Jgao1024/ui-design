import SwiftUI

/// Section Header：侧边栏分区标题（可折叠）。
struct SidebarSectionHeaderDemo: View {
    @State private var isExpanded = true

    var body: some View {
        List {
            Section("Section Header", isExpanded: $isExpanded) {
                Label("个人收藏", systemImage: "star")
                Label("最近项目", systemImage: "clock")
            }
        }
        .listStyle(.sidebar)
        .scrollDisabled(true)
        .frame(height: 170)
    }
}
