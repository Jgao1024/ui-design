import SwiftUI

/// Widgets（部分）：真实小组件需要独立的 Widget Extension；这里在 App 内模拟外观，仪表用真实 Gauge 样式。
struct WidgetsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "143:214872", "144:109471":
                HomeWidgetFamilyDemo(family: family)
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            LockWidgetView(solo: solo)
        }
    }
}
