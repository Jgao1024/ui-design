import SwiftUI

/// 无法静态强制的交互态提示。
struct InteractiveHint: View {
    var text: LocalizedStringResource = "交互态，请手动按住"

    var body: some View {
        Label {
            Text(text)
        } icon: {
            Image(systemName: "hand.point.up.left")
        }
        .font(.caption)
        .foregroundStyle(.secondary)
    }
}
