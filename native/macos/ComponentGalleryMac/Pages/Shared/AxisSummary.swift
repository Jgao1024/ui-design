import SwiftUI

/// 属性轴说明，每轴一行；Mode 轴注明由全局明暗开关控制。
struct AxisSummary: View {
    let axes: [PropertyAxis]

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            ForEach(axes) { axis in
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text(axis.name)
                        .bold()
                    Text(axis.values.joined(separator: ", "))
                    if axis.isAppearance {
                        Text("（由全局明暗开关控制）")
                            .foregroundStyle(.tertiary)
                    }
                }
            }
        }
        .font(.callout)
        .foregroundStyle(.secondary)
    }
}
