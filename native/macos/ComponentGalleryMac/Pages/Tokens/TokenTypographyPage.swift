import SwiftUI

/// 令牌页「文字样式」：tokens/typography.json 的 68 种样式。
struct TokenTypographyPage: View {
    let page: Page

    var body: some View {
        let styles = page.tokens?.styles ?? []

        VStack(alignment: .leading, spacing: 16) {
            PageHeader(page: page)
            TokenSectionTitle(title: "文字样式", count: styles.count)
            LazyVStack(alignment: .leading, spacing: 14) {
                ForEach(styles) { token in
                    TextStyleRow(token: token)
                }
            }
        }
    }
}
