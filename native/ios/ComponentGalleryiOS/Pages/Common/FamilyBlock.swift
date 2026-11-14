import SwiftUI

/// 一个公开族的区块：族名、变体数、属性轴说明、真实控件演示。
struct FamilyBlock<Content: View>: View {
    let family: ComponentSet
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                HStack(alignment: .firstTextBaseline) {
                    Text(family.name)
                        .font(.title3)
                        .bold()
                    Spacer()
                    Text("\(family.variants) 个变体")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                        .monospacedDigit()
                }

                Text(family.axesSummary)
                    .font(.caption)
                    .foregroundStyle(.secondary)

                if let axis = family.appearanceAxis {
                    Label("\(axis.name) 轴由全局明暗开关控制", systemImage: "circle.lefthalf.filled")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Text(family.id)
                    .font(.caption.monospaced())
                    .foregroundStyle(.tertiary)
            }

            DemoCard {
                content
            }
        }
    }
}
