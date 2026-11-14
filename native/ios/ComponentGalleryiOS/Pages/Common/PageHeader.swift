import SwiftUI

/// 页面顶部：页面名、分类、HIG 链接、SwiftUI 对应、族数。
struct PageHeader: View {
    let page: RegistryPage

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(page.name)
                .font(.largeTitle)
                .bold()

            Text("\(page.cat) \(page.catLabel)")
                .font(.subheadline)
                .foregroundStyle(.secondary)

            LevelSummary(level: page.level, apis: page.apis)

            ForEach(page.hig, id: \.self) { url in
                Link(destination: url) {
                    Label("HIG：\(url.lastPathComponent)", systemImage: "book")
                }
                .font(.subheadline)
            }

            if page.kind == .kit {
                Text("公开族 \(page.sets.count) · 独立组件 \(page.solo.count) · 变体 \(page.variantCount) · 内部件 \(page.internal.count)")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                    .monospacedDigit()
            }

            switch page.level {
            case .simulated:
                PageBanner(text: "模拟外观，系统不提供真实控件", systemImage: "paintbrush.pointed", tint: .purple)
            case .skipped:
                PageBanner(text: "不做：设备外框，没有对应的 SwiftUI API", systemImage: "nosign", tint: .gray)
            case .native, .bridged, .partial:
                EmptyView()
            }
        }
    }
}
