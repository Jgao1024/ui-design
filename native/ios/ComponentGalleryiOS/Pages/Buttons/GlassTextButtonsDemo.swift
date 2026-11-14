import SwiftUI

/// Button - Liquid Glass - Text：Size × Style × Is Enabled × Destructive，24 个变体，放在彩色底图上看折射。
struct GlassTextButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            ForEach([DemoButtonKind.glass, .glassProminent]) { kind in
                ForEach(ButtonStateCombo.all) { combo in
                    DemoCase(title: "\(kind.title) · \(combo.title)") {
                        HStack(spacing: 12) {
                            ForEach([DemoButtonSize.small, .medium, .large]) { size in
                                StyledDemoButton(kind: kind, size: size, label: .titleOnly,
                                                 isDestructive: combo.isDestructive, isEnabled: combo.isEnabled)
                            }
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
        Text("每行从左到右：Small、Medium、Large")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
