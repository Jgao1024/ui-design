import SwiftUI

/// SwiftUI 对应级别徽标 + API 说明（说明里的反引号按 Markdown 代码渲染）。
struct LevelSummary: View {
    let level: SupportLevel
    let apis: String

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("SwiftUI：\(level.rawValue)")
                .font(.subheadline)
                .bold()
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .foregroundStyle(level.tint)
                .background(level.tint.quaternary, in: .capsule)

            Text((try? AttributedString(markdown: apis)) ?? AttributedString(apis))
                .font(.subheadline)
        }
    }
}
