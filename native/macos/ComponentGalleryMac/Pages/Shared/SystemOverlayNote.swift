import SwiftUI

/// Overlay（弹出提醒或对话框时窗口内容上的遮罩）由系统在呈现时绘制。
struct SystemOverlayNote: View {
    var body: some View {
        Label("遮罩由系统在弹出提醒或对话框时自动绘制，点上方的按钮即可看到", systemImage: "rectangle.on.rectangle")
            .foregroundStyle(.secondary)
    }
}
