import SwiftUI

/// 工具栏里的下拉按钮。
struct ToolbarActionsMenu: View {
    var body: some View {
        Menu("操作", systemImage: "ellipsis.circle") {
            Button("复制") {}
            Button("移动到…") {}
        }
        .labelStyle(.iconOnly)
        .buttonStyle(.glass)
        .fixedSize()
    }
}
