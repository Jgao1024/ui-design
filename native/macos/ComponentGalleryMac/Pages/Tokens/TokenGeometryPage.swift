import SwiftUI

/// 令牌页「几何」：tokens/geometry.json 的圆角、间距、组件尺寸分布。
struct TokenGeometryPage: View {
    let page: Page

    private let columns = [GridItem(.adaptive(minimum: 120), spacing: 12, alignment: .top)]

    var body: some View {
        let radii = page.tokens?.cornerRadii ?? []
        let spacings = page.tokens?.itemSpacing ?? []
        let sizes = page.tokens?.componentSizes ?? []

        VStack(alignment: .leading, spacing: 16) {
            PageHeader(page: page)

            TokenSectionTitle(title: "圆角", count: radii.count)
            LazyVGrid(columns: columns, alignment: .leading, spacing: 12) {
                ForEach(radii) { token in
                    CornerRadiusSwatch(token: token)
                }
            }

            TokenSectionTitle(title: "间距（itemSpacing）", count: spacings.count)
            VStack(alignment: .leading, spacing: 8) {
                ForEach(spacings) { token in
                    SpacingSwatch(token: token)
                }
            }

            TokenSectionTitle(title: "组件尺寸", count: sizes.count)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 150), spacing: 8, alignment: .leading)], alignment: .leading, spacing: 6) {
                ForEach(sizes) { token in
                    Text("\(token.key.replacing("x", with: " × ")) · \(token.uses) 次")
                        .font(.callout.monospaced())
                }
            }
        }
    }
}
