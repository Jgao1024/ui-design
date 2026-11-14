import SwiftUI

/// 系统菜单栏右侧的 `MenuBarExtra` 菜单内容，在 Menu Bar and Dock 页打开开关后出现。
struct MenuBarExtraContent: View {
    @AppStorage("showsMenuBarExtra") private var showsMenuBarExtra = false

    var body: some View {
        Button("示例操作") {}
        Button("不可用操作") {}
            .disabled(true)
        Divider()
        Button("从菜单栏移除", action: remove)
    }

    private func remove() {
        showsMenuBarExtra = false
    }
}
