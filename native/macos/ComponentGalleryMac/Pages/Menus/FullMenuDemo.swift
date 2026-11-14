import SwiftUI

/// Menu 独立组件：完整菜单，分别用 `Menu` 按钮和 `.contextMenu`（右键）打开；菜单栏里另有 `CommandMenu`「示例菜单」。
struct FullMenuDemo: View {
    @State private var showsSidebar = true
    @State private var sortOrder = 0

    var body: some View {
        HStack(spacing: 24) {
            SampleMenuButton(title: "Menu 按钮", hasSelection: true)

            Text("在这里右键（或按住 Control 点按）")
                .padding(.horizontal, 16)
                .padding(.vertical, 20)
                .background(.fill.tertiary, in: .rect(cornerRadius: 10))
                .contextMenu {
                    SampleMenuItems(hasSelection: true, showsSidebar: $showsSidebar, sortOrder: $sortOrder)
                }

            Text("屏幕顶部菜单栏里的「示例菜单」由 `CommandMenu` 生成。")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }
}
