import SwiftUI

/// Alert 族：真实的 `.alert`。两个按钮时左右排列（Side-by-side），三个及以上时上下堆叠（Stacked）。
struct AlertDemo: View {
    @State private var isSideBySidePresented = false
    @State private var isStackedPresented = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 16) {
                Button("Side-by-side（2 个按钮）", action: showSideBySide)
                    .alert("要存储对文稿的更改吗？", isPresented: $isSideBySidePresented) {
                        Button("存储") {}
                        Button("取消", role: .cancel) {}
                    } message: {
                        Text("如果不存储，你的更改将会丢失。")
                    }

                Button("Stacked（3 个按钮）", action: showStacked)
                    .alert("要存储对文稿的更改吗？", isPresented: $isStackedPresented) {
                        Button("存储") {}
                        Button("不存储", role: .destructive) {}
                        Button("取消", role: .cancel) {}
                    } message: {
                        Text("如果不存储，你的更改将会丢失。")
                    }
            }
            Text("提醒由系统弹出，不能内联展示；按钮排列方式由系统按按钮数量决定。")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }

    private func showSideBySide() {
        isSideBySidePresented = true
    }

    private func showStacked() {
        isStackedPresented = true
    }
}
