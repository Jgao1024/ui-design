import SwiftUI

/// Layout Guides：iPhone Duo 布局参考图的示意版。真实布局请用 .safeAreaInset、.safeAreaBar 等，由系统提供边距。
struct LayoutGuidesPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { solo in
            DuoLayoutGuide(solo: solo)
        }
    }
}
