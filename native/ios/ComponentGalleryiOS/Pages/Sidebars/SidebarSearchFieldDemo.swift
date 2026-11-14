import SwiftUI

/// Sidebar Search Field：侧边栏顶部的搜索框。
struct SidebarSearchFieldDemo: View {
    @State private var query = ""

    var body: some View {
        NavigationStack {
            List {
                Label("收件箱", systemImage: "tray")
                Label("已发送", systemImage: "paperplane")
            }
            .listStyle(.sidebar)
            .navigationTitle("邮箱")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, placement: .navigationBarDrawer(displayMode: .always))
        }
        .frame(height: 240)
        .clipShape(.rect(cornerRadius: 16))
    }
}
