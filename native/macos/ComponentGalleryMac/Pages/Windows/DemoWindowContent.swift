import SwiftUI

/// 示例窗口内容：真实的标题栏、红绿灯、工具栏、侧边栏和搜索框。
/// 打开两个示例窗口即可对比 Active: True（前台）和 Active: False（后台）。
struct DemoWindowContent: View {
    let config: WindowDemoConfig

    @State private var columnVisibility: NavigationSplitViewVisibility
    @State private var selection: String? = "收件箱"
    @State private var searchText = ""
    @State private var viewMode = 0
    @State private var sortOrder = 0

    init(config: WindowDemoConfig) {
        self.config = config
        _columnVisibility = State(initialValue: config.showsSidebar ? .all : .detailOnly)
    }

    var body: some View {
        NavigationSplitView(columnVisibility: $columnVisibility) {
            List(selection: $selection) {
                Section("收藏") {
                    Label("收件箱", systemImage: "tray").tag("收件箱")
                    Label("已发送", systemImage: "paperplane").tag("已发送")
                    Label("草稿", systemImage: "doc").tag("草稿")
                }
                Section("标签") {
                    Label("工作", systemImage: "tag").tag("工作")
                    Label("个人", systemImage: "tag").tag("个人")
                }
            }
            .navigationSplitViewColumnWidth(min: 180, ideal: 200)
        } detail: {
            VStack(alignment: .leading, spacing: 8) {
                Text(config.figmaName)
                    .font(.title2)
                    .bold()
                Text(config.style.modifierName)
                    .font(.body.monospaced())
                Text("标题：\(config.showsTitle ? "显示" : ".toolbar(removing: .title)")　侧边栏：\(config.showsSidebar ? "显示" : "隐藏")")
                    .foregroundStyle(.secondary)
            }
            .padding()
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(.windowBackground)
        }
        .navigationTitle(selection ?? "示例窗口")
        .navigationSubtitle(config.style.figmaName)
        .toolbar(removing: config.showsTitle ? nil : .title)
        .toolbar(removing: config.showsSidebar ? nil : .sidebarToggle)
        .toolbar {
            DemoToolbarContent(viewMode: $viewMode, sortOrder: $sortOrder)
        }
        .searchable(text: $searchText, prompt: "搜索")
    }
}
