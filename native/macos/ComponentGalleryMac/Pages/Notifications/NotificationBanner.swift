import SwiftUI

/// 自绘：通知横幅的模拟外观（App 图标 + 标题 + 正文 + 时间，Liquid Glass 底）。
struct NotificationBanner: View {
    var title: LocalizedStringResource = "日历"
    var message: LocalizedStringResource = "设计评审 · 10 分钟后在 3 号会议室开始"

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "calendar")
                .font(.title2)
                .foregroundStyle(.white)
                .frame(width: 36, height: 36)
                .background(.red.gradient, in: .rect(cornerRadius: 8))
                .accessibilityHidden(true)

            VStack(alignment: .leading, spacing: 2) {
                HStack {
                    Text(title)
                        .bold()
                    Spacer()
                    Text("现在")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                Text(message)
                    .lineLimit(2)
            }
        }
        .padding(12)
        .frame(width: 344)
        .glassEffect(.regular, in: .rect(cornerRadius: 18))
    }
}
