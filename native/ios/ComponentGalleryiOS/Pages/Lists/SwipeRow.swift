import SwiftUI

struct SwipeRow: View {
    let title: String
    let subtitle: String?
    let labelStyle: DemoLabelMode

    var body: some View {
        VStack(alignment: .leading) {
            Text(title)
            if let subtitle {
                Text(subtitle)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, subtitle == nil ? 0 : 8)
        .swipeActions(edge: .trailing) {
            Button("删除", systemImage: "trash", role: .destructive) {}
            Button("标记", systemImage: "flag") {}
                .tint(.orange)
        }
        .swipeActions(edge: .leading) {
            Button("已读", systemImage: "envelope.open") {}
                .tint(.blue)
        }
        .labelStyle(DemoLabelStyle(mode: labelStyle))
    }
}
