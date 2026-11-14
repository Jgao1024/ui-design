import SwiftUI

/// 菜单栏里的「示例菜单」：真实的标题、操作项、快捷键、勾选项、禁用项、分隔线和子菜单。
struct GalleryCommands: Commands {
    @AppStorage("menuDemoShowsGrid") private var showsGrid = true

    var body: some Commands {
        CommandMenu("示例菜单") {
            Section("标题（Header）") {
                Button("普通操作") {}
                    .keyboardShortcut("1", modifiers: [.command, .option])
                Button("不可用操作") {}
                    .disabled(true)
                Toggle("带勾选的项", isOn: $showsGrid)
            }

            Divider()

            Menu("子菜单") {
                Button("子项 A") {}
                Button("子项 B") {}
            }
        }
    }
}
