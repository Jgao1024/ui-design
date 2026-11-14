import SwiftUI

/// 页内搜索框：放大镜 + 无边框 `TextField` + 清除按钮，胶囊底色自绘。
/// macOS 上真正的搜索框只能由 `.searchable` 放进窗口工具栏，见示例窗口。
struct SearchFieldImitation: View {
    @Binding var text: String
    let focus: FocusState<SearchFieldCell?>.Binding
    let cell: SearchFieldCell?

    var body: some View {
        HStack(spacing: 4) {
            Image(systemName: "magnifyingglass")
                .foregroundStyle(.secondary)
                .accessibilityHidden(true)
            TextField("搜索", text: $text)
                .textFieldStyle(.plain)
                .focused(focus, equals: cell)
            Button("清除", systemImage: "xmark.circle.fill", action: clear)
                .labelStyle(.iconOnly)
                .buttonStyle(.borderless)
                .foregroundStyle(.secondary)
                .opacity(text.isEmpty ? 0 : 1)
                .disabled(text.isEmpty)
        }
        .padding(.horizontal, 8)
        .frame(width: 180, height: 26)
        .background(.fill.tertiary, in: .capsule)
    }

    private func clear() {
        text = ""
    }
}
