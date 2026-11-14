import SwiftUI

/// 无法实现的组件：显示出来并写明原因，不静默省略。
struct UnavailableDemo: View {
    let reason: LocalizedStringResource

    var body: some View {
        Label {
            Text("无法实现：\(reason)")
        } icon: {
            Image(systemName: "nosign")
        }
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity, minHeight: 60)
        .overlay {
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(.secondary, style: StrokeStyle(lineWidth: 1, dash: [4]))
        }
    }
}
