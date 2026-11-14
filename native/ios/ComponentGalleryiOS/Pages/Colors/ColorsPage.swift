import SwiftUI

/// Colors 画板页：kit 里只有内部件（色板模板），颜色本身见令牌页「颜色」。
struct ColorsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
