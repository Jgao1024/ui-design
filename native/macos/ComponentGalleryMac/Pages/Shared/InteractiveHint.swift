import SwiftUI

/// Clicked / Pressed / Hover 无法静态强制，旁边放这条提示。
struct InteractiveHint: View {
    var text: LocalizedStringResource = "交互态，请手动按住或悬停"

    var body: some View {
        Label {
            Text(text)
        } icon: {
            Image(systemName: "hand.tap")
        }
        .font(.caption)
        .foregroundStyle(.orange)
    }
}
