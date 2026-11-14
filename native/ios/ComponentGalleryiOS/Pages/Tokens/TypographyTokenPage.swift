import SwiftUI

/// 文字样式令牌：用系统字体按令牌数值真实渲染样例。
struct TypographyTokenPage: View {
    let page: RegistryPage
    let tokens: TokenData

    var body: some View {
        TokenPageContainer(page: page) {
            TokenSectionTitle(title: "文字样式", count: tokens.styles.count)
            Text("样例按令牌的固定字号渲染，用于对照设计稿，不跟随动态字体。")
                .font(.footnote)
                .foregroundStyle(.secondary)
            ForEach(tokens.styles.enumerated(), id: \.offset) { _, style in
                TextStyleRow(token: style)
            }
        }
    }
}
