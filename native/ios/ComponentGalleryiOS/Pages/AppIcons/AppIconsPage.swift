import SwiftUI

/// App Icons 画板页：kit 里只有内部件（图标网格模板）；图标外观见 System 页的 App Icon 族。
struct AppIconsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
