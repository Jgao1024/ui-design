import SwiftUI

/// Context Menu：长按卡片弹出真实上下文菜单，顶部 ControlGroup 即 Horizontal 排列。
struct ContextMenuDemo: View {
    let showsHorizontalGroup: Bool

    var body: some View {
        Label("长按这张卡片", systemImage: "photo")
            .font(.headline)
            .frame(maxWidth: .infinity, minHeight: 120)
            .background(.tint.quaternary, in: .rect(cornerRadius: 16))
            .contentShape(.contextMenuPreview, .rect(cornerRadius: 16))
            .contextMenu {
                if showsHorizontalGroup {
                    ControlGroup {
                        Button("复制", systemImage: "doc.on.doc") {}
                        Button("分享", systemImage: "square.and.arrow.up") {}
                        Button("收藏", systemImage: "heart") {}
                    }
                }
                Button("拷贝", systemImage: "doc.on.doc") {}
                Button("添加到相簿", systemImage: "rectangle.stack.badge.plus") {}
                Divider()
                Button("删除", systemImage: "trash", role: .destructive) {}
            }
    }
}
