import SwiftUI

/// 演示用的下拉按钮（Pull-down Button）。
struct ActionsMenu: View {
    var body: some View {
        Menu("操作") {
            Button("复制") {}
            Button("重命名") {}
            Divider()
            Button("删除", role: .destructive) {}
        }
        .fixedSize()
    }
}
