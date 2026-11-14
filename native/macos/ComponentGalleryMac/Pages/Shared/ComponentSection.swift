import SwiftUI

/// 一个公开族或独立组件的区块：Figma 原名、变体数、nodeId、属性轴说明、演示。
struct ComponentSection<Content: View>: View {
    let component: Component
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                Text(component.name)
                    .font(.title2)
                    .bold()

                Text(component.variants.isEmpty ? "独立组件" : "\(component.variants.count) 个变体")
                    .foregroundStyle(.secondary)

                Spacer()

                Text(component.id)
                    .font(.callout.monospaced())
                    .foregroundStyle(.secondary)
                    .textSelection(.enabled)
            }

            if !component.axes.isEmpty {
                AxisSummary(axes: component.axes)
            }

            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(.fill.quinary, in: .rect(cornerRadius: 12))
    }
}
