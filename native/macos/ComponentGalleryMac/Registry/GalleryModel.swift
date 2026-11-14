import Observation

/// 持有加载状态；registry.json 只在启动时读取一次。
@MainActor
@Observable
final class GalleryModel {
    private(set) var state = LoadState.loading

    func load() async {
        do {
            state = .loaded(try await RegistryLoader.load())
        } catch {
            state = .failed(error.localizedDescription)
        }
    }
}
