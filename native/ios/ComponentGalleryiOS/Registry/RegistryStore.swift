import Observation

/// 持有加载状态，供根视图读取。
@MainActor
@Observable
final class RegistryStore {
    private(set) var phase: LoadPhase = .loading

    func load() async {
        do {
            phase = .loaded(try await RegistryLoader.load())
        } catch {
            phase = .failed(error.localizedDescription)
        }
    }
}
