import SwiftUI

/// 一个带真实顶部工具栏的导航栈。
struct TopToolbarStack: View {
    let style: TopBarStyle

    var body: some View {
        NavigationStack {
            List(1...20, id: \.self) { row in
                Text("第 \(row) 行")
            }
            .navigationTitle("标题")
            .navigationSubtitle(style.hasSubtitle ? "副标题" : "")
            .toolbarTitleDisplayMode(style.displayMode)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("返回", systemImage: "chevron.backward") {}
                }
                ToolbarItem(placement: .primaryAction) {
                    Button("添加", systemImage: "plus") {}
                }
                ToolbarItemGroup(placement: .secondaryAction) {
                    Button("分享", systemImage: "square.and.arrow.up") {}
                    Button("复制", systemImage: "doc.on.doc") {}
                }
            }
        }
    }
}
