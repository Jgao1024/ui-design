import SwiftUI

/// 自绘页面顶部固定显示的说明。
struct SimulatedBanner: View {
    var body: some View {
        Label("模拟外观，系统不提供真实控件", systemImage: "paintbrush.pointed")
            .bold()
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(.yellow.opacity(0.25), in: .rect(cornerRadius: 8))
    }
}
