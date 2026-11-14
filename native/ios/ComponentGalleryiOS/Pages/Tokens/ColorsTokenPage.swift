import SwiftUI

/// 颜色令牌：纯色色块（hex / alpha / 使用次数）与渐变。
struct ColorsTokenPage: View {
    let page: RegistryPage
    let tokens: TokenData

    var body: some View {
        TokenPageContainer(page: page) {
            TokenSectionTitle(title: "纯色", count: tokens.colors.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 104), spacing: 12)], spacing: 12) {
                ForEach(tokens.colors.enumerated(), id: \.offset) { _, color in
                    ColorSwatch(token: color)
                }
            }

            TokenSectionTitle(title: "渐变", count: tokens.gradients.count)
            ForEach(tokens.gradients.enumerated(), id: \.offset) { _, gradient in
                GradientSwatch(token: gradient)
            }
        }
    }
}
