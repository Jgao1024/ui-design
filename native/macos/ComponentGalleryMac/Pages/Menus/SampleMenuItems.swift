import SwiftUI

/// 菜单示例内容：标题、操作项（含快捷键）、禁用项、分隔线、子菜单；`hasSelection` 时带勾选项。
struct SampleMenuItems: View {
    let hasSelection: Bool
    @Binding var showsSidebar: Bool
    @Binding var sortOrder: Int

    var body: some View {
        Section("Header") {
            Button("新建", systemImage: "plus") {}
                .keyboardShortcut("n")
            Button("复制", systemImage: "doc.on.doc") {}
                .keyboardShortcut("d")
            Button("不可用的操作") {}
                .disabled(true)
        }

        Divider()

        if hasSelection {
            Section("显示") {
                Toggle("显示侧边栏", isOn: $showsSidebar)
                Picker("排序方式", selection: $sortOrder) {
                    Text("名称").tag(0)
                    Text("日期").tag(1)
                }
                .pickerStyle(.inline)
            }
            Divider()
        }

        Menu("子菜单（Submenu）") {
            Button("子项 A") {}
            Button("子项 B") {}
        }
    }
}
