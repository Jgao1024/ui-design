import SwiftUI

/// 令牌页「效果与材质」：tokens/effects.json 的效果实物。
struct TokenEffectsPage: View {
    let page: Page

    private let columns = [GridItem(.adaptive(minimum: 170), spacing: 12, alignment: .top)]

    var body: some View {
        let effects = page.tokens?.effects ?? []

        VStack(alignment: .leading, spacing: 16) {
            PageHeader(page: page)
            TokenSectionTitle(title: "效果", count: effects.count)
            LazyVGrid(columns: columns, alignment: .leading, spacing: 12) {
                ForEach(effects.indices, id: \.self) { index in
                    EffectTokenSwatch(token: effects[index])
                }
            }
        }
    }
}
