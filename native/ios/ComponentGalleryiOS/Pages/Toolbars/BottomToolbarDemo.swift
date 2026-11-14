import SwiftUI

/// Toolbar - Bottom：切换 Type 看真实底部工具栏。
struct BottomToolbarDemo: View {
    var types: [BottomBarType] = BottomBarType.allCases

    @State private var type = BottomBarType.buttons

    var body: some View {
        if types.count > 1 {
            Picker("Type", selection: $type) {
                ForEach(types) { Text($0.rawValue).tag($0) }
            }
            .pickerStyle(.menu)
        }

        NavigationStack {
            BottomToolbarSample(type: type)
                .navigationTitle("底部工具栏")
                .navigationBarTitleDisplayMode(.inline)
        }
        .id(type)
        .frame(height: 380)
        .clipShape(.rect(cornerRadius: 16))

        if type == .searchFocus {
            InteractiveHint(text: "Search with Focus：点击「聚焦搜索」或底部搜索框，搜索框展开并弹出键盘")
        }
    }
}
