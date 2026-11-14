import SwiftUI

/// 点击按钮弹出真实 Menu，内容按族不同而不同。
struct MenuDemo: View {
    let kind: MenuKind

    @State private var showsPreview = true
    @State private var sort = "名称"

    var body: some View {
        Menu("打开菜单", systemImage: "ellipsis.circle") {
            switch kind {
            case .sectionTitle:
                Section("Section Title") {
                    Button("新建文件夹", systemImage: "folder.badge.plus") {}
                    Button("新建文档", systemImage: "doc.badge.plus") {}
                }
            case .separator:
                Button("拷贝", systemImage: "doc.on.doc") {}
                Divider()
                Button("删除", systemImage: "trash", role: .destructive) {}
            case .items:
                Section("Menu has Selection: False") {
                    Button("Default：重命名", systemImage: "pencil") {}
                    Button("Disabled：移动", systemImage: "folder") {}
                        .disabled(true)
                    Button("Destructive：删除", systemImage: "trash", role: .destructive) {}
                }
                Section("Menu has Selection: True") {
                    Toggle("显示预览", systemImage: "eye", isOn: $showsPreview)
                }
            case .submenus:
                Menu("Open：排序方式", systemImage: "arrow.up.arrow.down") {
                    Picker("排序方式", selection: $sort) {
                        ForEach(["名称", "日期", "大小"], id: \.self) { Text($0) }
                    }
                }
                Menu("Disabled：导出", systemImage: "square.and.arrow.up") {
                    Button("PDF") {}
                }
                .disabled(true)
            case .quickAction:
                ControlGroup {
                    Button("拷贝", systemImage: "doc.on.doc") {}
                    Button("分享", systemImage: "square.and.arrow.up") {}
                    Button("删除", systemImage: "trash", role: .destructive) {}
                }
                Button("其他操作", systemImage: "ellipsis") {}
            case .full:
                ControlGroup {
                    Button("拷贝", systemImage: "doc.on.doc") {}
                    Button("分享", systemImage: "square.and.arrow.up") {}
                }
                Section("整理") {
                    Button("重命名", systemImage: "pencil") {}
                    Menu("移到", systemImage: "folder") {
                        Button("文稿") {}
                        Button("下载") {}
                    }
                }
                Toggle("显示预览", systemImage: "eye", isOn: $showsPreview)
                Divider()
                Button("删除", systemImage: "trash", role: .destructive) {}
            }
        }
        .buttonStyle(.bordered)
        InteractiveHint(text: "点击按钮弹出系统菜单")
    }
}
