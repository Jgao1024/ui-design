import SwiftUI

/// State: Focused 单元格：控件下方放一个「聚焦」按钮，用 `@FocusState` 把焦点移进去。
/// 不在出现时自动聚焦，避免抢走内容区的焦点导致 ← → 无法翻页。
struct FocusableCell<Content: View>: View {
    let action: () -> Void
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            content
            Button("聚焦", systemImage: "scope", action: action)
                .controlSize(.small)
                .buttonStyle(.borderless)
        }
    }
}
