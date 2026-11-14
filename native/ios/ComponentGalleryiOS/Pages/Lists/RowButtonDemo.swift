import SwiftUI

/// Row - Button：Default、Destructive、Disabled。
struct RowButtonDemo: View {
    var body: some View {
        List {
            Button("Default：添加到个人收藏") {}
            Button("Destructive：删除联系人", role: .destructive) {}
            Button("Disabled：共享联系人") {}
                .disabled(true)
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 210)
    }
}
