import SwiftUI

/// Row with Swipe Actions：Type（Symbol Only / Symbol and Label / Tall）× Swipe（Left / Right）。
struct SwipeRowsDemo: View {
    var body: some View {
        List {
            SwipeRow(title: "Type: Symbol Only", subtitle: nil, labelStyle: DemoLabelMode.iconOnly)
            SwipeRow(title: "Type: Symbol and Label", subtitle: nil, labelStyle: .titleAndIcon)
            SwipeRow(title: "Type: Symbol and Label Tall", subtitle: "两行高的行，操作按钮随行高拉伸", labelStyle: .titleAndIcon)
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 260)
        InteractiveHint(text: "Swipe: Left / Right：在行上向左或向右滑动露出操作按钮")
        UnreproducedList(items: [
            "Symbol and Label：系统在空间够时才同时显示图标和文字，窄行可能只显示图标",
        ])
    }
}
