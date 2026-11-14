import SwiftUI

/// 内部件折叠区：只列名字，不做演示，不参与搜索。
struct InternalPartsSection: View {
    let parts: [InternalPart]

    @State private var isExpanded = false

    var body: some View {
        DisclosureGroup(isExpanded: $isExpanded) {
            VStack(alignment: .leading, spacing: 6) {
                ForEach(parts) { part in
                    LabeledContent {
                        Text(part.variants > 0 ? "\(part.variants) 个变体" : "独立")
                    } label: {
                        Text(part.name)
                        Text(part.id)
                            .monospaced()
                    }
                    .font(.footnote)
                }
            }
            .padding(.top, 8)
        } label: {
            Text("内部件 \(parts.count) 个（默认隐藏）")
                .font(.headline)
        }
    }
}
