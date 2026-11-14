import SwiftUI

/// BG：侧边栏选中行的底色，Active True / False。
struct SidebarBGDemo: View {
    @State private var selection: String? = "收件箱"

    var body: some View {
        List(selection: $selection) {
            Label("收件箱", systemImage: "tray").tag("收件箱")
            Label("已发送", systemImage: "paperplane").tag("已发送")
            Label("草稿", systemImage: "doc").tag("草稿")
        }
        .listStyle(.sidebar)
        .scrollDisabled(true)
        .frame(height: 190)
        UnreproducedList(items: [
            "Active: False：窗口失去焦点时的灰色选中底由系统切换，无法静态强制；在 iPad 上开两个窗口来回切换可见",
        ])
    }
}
