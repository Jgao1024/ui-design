import SwiftUI

/// 主窗口根视图：加载 registry.json，应用全局明暗设置。
struct RootView: View {
    @State private var gallery = GalleryModel()
    @AppStorage("appearance") private var appearance = AppearanceMode.system

    var body: some View {
        Group {
            switch gallery.state {
            case .loading:
                ProgressView("正在加载组件登记表…")
            case .failed(let message):
                ContentUnavailableView("无法加载 registry.json", systemImage: "exclamationmark.triangle", description: Text(message))
            case .loaded(let index):
                GalleryShell(index: index)
            }
        }
        .frame(minWidth: 900, minHeight: 600)
        .preferredColorScheme(appearance.colorScheme)
        .task { await gallery.load() }
    }
}
