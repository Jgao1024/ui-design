import SwiftUI

/// 模拟 iPhone Duo 状态栏：Horizontal（常规）与 Vertical（外屏横置时贴边竖排）。
struct SimDuoStatusBar: View {
    let isVertical: Bool

    var body: some View {
        let layout = isVertical ? AnyLayout(VStackLayout(spacing: 10)) : AnyLayout(HStackLayout(spacing: 12))
        layout {
            Text("9:41")
                .font(.headline)
            SimStatusIcons(axis: isVertical ? .vertical : .horizontal)
        }
        .padding(12)
        .background(.fill.tertiary, in: .rect(cornerRadius: 12))
    }
}
