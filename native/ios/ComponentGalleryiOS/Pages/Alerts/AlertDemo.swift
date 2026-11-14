import SwiftUI

/// Alert：Button Layout Side-by-Side（两个按钮）与 Stacked（三个及以上按钮）。
struct AlertDemo: View {
    @State private var showsSideBySide = false
    @State private var showsStacked = false

    var body: some View {
        DemoCase(title: "Button Layout: Side-by-Side") {
            Button("两个按钮的提醒", action: presentSideBySide)
                .buttonStyle(.bordered)
                .alert("允许“地图”使用你的位置？", isPresented: $showsSideBySide) {
                    Button("不允许", role: .cancel) {}
                    Button("允许") {}
                } message: {
                    Text("你的位置用于显示附近的地点。")
                }
        }
        DemoCase(title: "Button Layout: Stacked") {
            Button("三个按钮的提醒", action: presentStacked)
                .buttonStyle(.bordered)
                .alert("保存更改？", isPresented: $showsStacked) {
                    Button("保存") {}
                    Button("不保存", role: .destructive) {}
                    Button("取消", role: .cancel) {}
                } message: {
                    Text("如果不保存，你的更改将会丢失。")
                }
        }
        InteractiveHint(text: "点击按钮弹出系统提醒；按钮数量决定并排还是竖排")
    }

    private func presentSideBySide() {
        showsSideBySide = true
    }

    private func presentStacked() {
        showsStacked = true
    }
}
