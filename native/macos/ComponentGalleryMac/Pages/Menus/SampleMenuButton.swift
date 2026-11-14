import SwiftUI

/// 打开示例菜单的按钮；菜单本体（背景、标题、分隔线、菜单项）都由系统绘制。
struct SampleMenuButton: View {
    let title: LocalizedStringResource
    let hasSelection: Bool

    @State private var showsSidebar = true
    @State private var sortOrder = 0

    var body: some View {
        Menu {
            SampleMenuItems(hasSelection: hasSelection, showsSidebar: $showsSidebar, sortOrder: $sortOrder)
        } label: {
            Text(title)
        }
        .fixedSize()
    }
}
