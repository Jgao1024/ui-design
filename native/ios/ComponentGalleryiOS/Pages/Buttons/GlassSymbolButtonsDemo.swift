import SwiftUI

/// Button - Liquid Glass - Symbol：Style × Is Enabled × Destructive，8 个圆形图标按钮。
struct GlassSymbolButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            ForEach([DemoButtonKind.glass, .glassProminent]) { kind in
                DemoCase(title: "\(kind.title)") {
                    HStack(spacing: 16) {
                        ForEach(ButtonStateCombo.all) { combo in
                            StyledDemoButton(kind: kind, size: .large, label: .iconOnly,
                                             isDestructive: combo.isDestructive, isEnabled: combo.isEnabled)
                                .buttonBorderShape(.circle)
                        }
                    }
                }
            }
        }
        .padding()
        .background {
            ColorfulBackdrop()
                .opacity(0.5)
        }
        .clipShape(.rect(cornerRadius: 16))
        Text("每行从左到右：启用、启用 + 破坏性、禁用、禁用 + 破坏性")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
