import SwiftUI

/// 效果令牌：Material 与 Liquid Glass 实物，以及每个阴影 / 模糊令牌的预览。
struct EffectsTokenPage: View {
    let page: RegistryPage
    let tokens: TokenData

    var body: some View {
        TokenPageContainer(page: page) {
            Text("材质实物")
                .font(.title2)
                .bold()
            MaterialSamples()

            TokenSectionTitle(title: "效果令牌", count: tokens.effects.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 150), spacing: 16)], spacing: 16) {
                ForEach(tokens.effects.enumerated(), id: \.offset) { _, effect in
                    EffectSwatch(token: effect)
                }
            }
        }
    }
}
