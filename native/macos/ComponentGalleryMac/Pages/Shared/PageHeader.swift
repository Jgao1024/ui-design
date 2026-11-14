import SwiftUI

/// 页首：页面名、分类、HIG 链接、SwiftUI 对应（级别和 API）、数量统计。
struct PageHeader: View {
    let page: Page

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(page.name)
                .font(.largeTitle)
                .bold()

            HStack(spacing: 16) {
                Text("分类 \(page.category) \(page.categoryLabel)")
                    .foregroundStyle(.secondary)

                if page.hig.isEmpty {
                    Text("无对应 HIG 页")
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(page.hig) { link in
                        Link("HIG：\(link.slug)", destination: link.url)
                    }
                }
            }

            HStack(alignment: .firstTextBaseline, spacing: 8) {
                LevelBadge(level: page.swiftui.level)
                Text(page.swiftui.apiText)
                    .textSelection(.enabled)
            }

            if let summary = page.summary {
                Text(summary)
                    .foregroundStyle(.secondary)
            }

            if page.kind == "kit" {
                Text("公开族 \(page.families.count) · 独立组件 \(page.solos.count) · 变体 \(page.variantCount) · 内部件 \(page.internals.count)")
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
            }

            if page.swiftui.isSimulated {
                SimulatedBanner()
            }
        }
    }
}
