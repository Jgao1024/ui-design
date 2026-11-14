import SwiftUI

/// 几何令牌：圆角、间距、组件尺寸及使用次数。
struct GeometryTokenPage: View {
    let page: RegistryPage
    let tokens: TokenData

    var body: some View {
        TokenPageContainer(page: page) {
            TokenSectionTitle(title: "圆角", count: tokens.cornerRadii.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 12)], spacing: 12) {
                ForEach(tokens.cornerRadii.enumerated(), id: \.offset) { _, item in
                    CornerRadiusSwatch(item: item)
                }
            }

            TokenSectionTitle(title: "间距", count: tokens.itemSpacing.count)
            ForEach(tokens.itemSpacing.enumerated(), id: \.offset) { _, item in
                SpacingRow(item: item)
            }

            TokenSectionTitle(title: "组件尺寸", count: tokens.componentSizes.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 12)], spacing: 12) {
                ForEach(tokens.componentSizes.enumerated(), id: \.offset) { _, item in
                    SizeSwatch(item: item)
                }
            }
        }
    }
}
