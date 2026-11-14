import SwiftUI

/// 通知卡片本体：玻璃底 + App 图标 + 标题正文，展开时带图片与操作。
struct SimNotificationCard: View {
    let stackCount: Int
    let isExpanded: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(alignment: .top, spacing: 10) {
                SimAppIcon(systemImage: "message.fill", tint: .green, size: 38)
                VStack(alignment: .leading, spacing: 2) {
                    HStack {
                        Text("小明")
                            .font(.subheadline)
                            .bold()
                        Spacer()
                        Text("现在")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                    Text("晚上一起吃饭吗？我在公司楼下等你。")
                        .font(.subheadline)
                        .lineLimit(isExpanded ? nil : 2)
                    if stackCount > 1 {
                        Text("另外 \(stackCount - 1) 条通知")
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }
            }
            if isExpanded {
                RoundedRectangle(cornerRadius: 14)
                    .fill(.tint.quaternary)
                    .frame(height: 120)
                    .overlay {
                        Image(systemName: "photo")
                            .font(.largeTitle)
                            .foregroundStyle(.secondary)
                    }
                    .accessibilityHidden(true)
                HStack {
                    Text("回复")
                        .frame(maxWidth: .infinity)
                    Text("标记为已读")
                        .frame(maxWidth: .infinity)
                }
                .font(.subheadline)
                .padding(.vertical, 8)
                .background(.fill.tertiary, in: .rect(cornerRadius: 12))
            }
        }
        .padding(14)
        .glassEffect(.regular, in: .rect(cornerRadius: 22))
    }
}
