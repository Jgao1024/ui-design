import SwiftUI

/// 没有复现的变体：轴值 + 原因，灰色小字。
struct UnreproducedList: View {
    let items: [LocalizedStringResource]

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("未复现")
                .bold()
            ForEach(items.enumerated(), id: \.offset) { _, item in
                Text("• \(item)")
            }
        }
        .font(.caption)
        .foregroundStyle(.secondary)
    }
}
