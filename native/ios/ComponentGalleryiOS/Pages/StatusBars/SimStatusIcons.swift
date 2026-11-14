import SwiftUI

/// 模拟状态栏右侧图标：蜂窝信号、Wi-Fi、电池。
struct SimStatusIcons: View {
    var axis: Axis = .horizontal

    var body: some View {
        let layout = axis == .horizontal ? AnyLayout(HStackLayout(spacing: 6)) : AnyLayout(VStackLayout(spacing: 6))
        layout {
            Image(systemName: "cellularbars")
            Image(systemName: "wifi")
            Image(systemName: "battery.100percent")
        }
        .font(.subheadline)
        .accessibilityElement(children: .ignore)
        .accessibilityLabel("信号、Wi-Fi、电量满")
    }
}
