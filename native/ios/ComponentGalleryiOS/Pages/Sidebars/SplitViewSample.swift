import SwiftUI

/// 真实的 NavigationSplitView：宽屏显示侧边栏 + 详情，窄屏自动折叠成栈。
struct SplitViewSample: View {
    @State private var selection: String? = "收件箱"
    @State private var query = ""

    private let folders = ["收件箱", "已发送", "草稿", "废纸篓"]

    var body: some View {
        NavigationSplitView {
            List(folders, id: \.self, selection: $selection) { folder in
                Label(folder, systemImage: "folder")
            }
            .navigationTitle("邮箱")
            .searchable(text: $query, placement: .sidebar)
        } detail: {
            ContentUnavailableView(selection ?? "未选择", systemImage: "envelope", description: Text("详情栏"))
        }
        .frame(height: 420)
        .clipShape(.rect(cornerRadius: 16))
    }
}
