import SwiftUI

/// 用 ShareLink 弹出系统分享面板（iPhone 为 sheet，iPad 为 popover，遮罩由系统绘制）。
struct ShareSheetDemo: View {
    let note: LocalizedStringResource

    var body: some View {
        ShareLink(item: "iOS 27 组件画廊", subject: Text("iOS 27 组件画廊"), message: Text("来自原生 SwiftUI 演示")) {
            Label("分享", systemImage: "square.and.arrow.up")
        }
        .buttonStyle(.bordered)
        InteractiveHint(text: note)
    }
}
