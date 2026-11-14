import SwiftUI

/// 按 Figma 轴值组合出的真实系统按钮。
struct StyledDemoButton: View {
    let kind: DemoButtonKind
    var size: DemoButtonSize = .medium
    var label: DemoLabelMode = .titleOnly
    var isDestructive = false
    var isEnabled = true

    var body: some View {
        Group {
            switch kind {
            case .borderless:
                button.buttonStyle(.borderless)
            case .bordered:
                button.buttonStyle(.bordered)
            case .borderedProminent:
                button.buttonStyle(.borderedProminent)
            case .glass:
                button.buttonStyle(.glass)
            case .glassProminent:
                button.buttonStyle(.glassProminent)
            }
        }
        .labelStyle(DemoLabelStyle(mode: label))
        .controlSize(size.controlSize)
        .disabled(isEnabled == false)
    }

    private var button: Button<Label<Text, Image>> {
        Button(isDestructive ? "删除" : "按钮", systemImage: isDestructive ? "trash" : "star", role: isDestructive ? .destructive : nil) {}
    }
}
