import SwiftUI

/// 按 Figma Style 渲染一个真实的 `Button`。
struct SampleButton: View {
    let sample: ButtonSample

    var body: some View {
        switch sample {
        case .bordered:
            Button("Label") {}
                .buttonStyle(.bordered)
        case .tinted:
            Button("Label") {}
                .buttonStyle(.bordered)
                .tint(.accentColor)
        case .destructive:
            Button("Label", role: .destructive) {}
                .buttonStyle(.bordered)
        case .prominent:
            Button("Label") {}
                .buttonStyle(.borderedProminent)
        case .prominentDestructive:
            Button("Label", role: .destructive) {}
                .buttonStyle(.borderedProminent)
        case .borderless:
            Button("Label") {}
                .buttonStyle(.borderless)
        }
    }
}
