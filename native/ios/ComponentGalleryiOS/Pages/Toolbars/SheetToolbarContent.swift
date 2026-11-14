import SwiftUI

/// Sheet 里的顶部工具栏：取消 / 完成用语义化 placement。
struct SheetToolbarContent: View {
    let style: TopBarStyle

    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List(1...10, id: \.self) { row in
                Text("第 \(row) 行")
            }
            .navigationTitle("Sheet 标题")
            .navigationSubtitle(style.hasSubtitle ? "副标题" : "")
            .toolbarTitleDisplayMode(style.displayMode)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("取消", systemImage: "xmark", action: close)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("完成", systemImage: "checkmark", action: close)
                }
            }
        }
        .presentationDetents([.medium, .large])
    }

    private func close() {
        dismiss()
    }
}
