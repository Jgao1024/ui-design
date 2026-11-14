import SwiftUI

/// 令牌页「颜色」：tokens/colors.json 的纯色与渐变。
struct TokenColorsPage: View {
    let page: Page

    private let columns = [GridItem(.adaptive(minimum: 130), spacing: 12, alignment: .top)]

    var body: some View {
        let colors = page.tokens?.colors ?? []
        let gradients = page.tokens?.gradients ?? []

        VStack(alignment: .leading, spacing: 16) {
            PageHeader(page: page)

            TokenSectionTitle(title: "纯色", count: colors.count)
            LazyVGrid(columns: columns, alignment: .leading, spacing: 12) {
                ForEach(colors) { token in
                    ColorTokenSwatch(token: token)
                }
            }

            TokenSectionTitle(title: "渐变", count: gradients.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 220), spacing: 12, alignment: .top)], alignment: .leading, spacing: 12) {
                ForEach(gradients.indices, id: \.self) { index in
                    GradientTokenSwatch(token: gradients[index])
                }
            }
        }
    }
}
