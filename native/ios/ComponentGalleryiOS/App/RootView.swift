import SwiftUI

/// 加载 registry.json，成功后进入画廊。
struct RootView: View {
    @State private var store = RegistryStore()
    @AppStorage(AppScene.themeKey) private var theme: ThemeMode = .system

    var body: some View {
        Group {
            switch store.phase {
            case .loading:
                ProgressView("正在加载登记表")
            case .loaded(let registry):
                GalleryView(registry: registry)
            case .failed(let message):
                ContentUnavailableView("无法加载登记表", systemImage: "exclamationmark.triangle", description: Text(message))
            }
        }
        .preferredColorScheme(theme.colorScheme)
        .task {
            await store.load()
        }
    }
}
