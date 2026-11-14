import SwiftUI

/// Figma Colors 页：没有公开族，只有 4 个色板内部件；补充系统语义色实物。
struct ColorsPage: View {
    let page: Page

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            PageScaffold(page: page) { _ in
                PlaceholderDemo()
            }
            SemanticColorsSection()
        }
    }
}
