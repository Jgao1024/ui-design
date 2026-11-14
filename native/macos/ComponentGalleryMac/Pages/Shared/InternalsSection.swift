import SwiftUI

/// 内部件折叠区：默认折叠，只列名字和 nodeId，不做演示。
struct InternalsSection: View {
    let parts: [InternalPart]

    @State private var isExpanded = false

    var body: some View {
        DisclosureGroup("内部件 \(parts.count) 个（默认折叠，不做演示）", isExpanded: $isExpanded) {
            VStack(alignment: .leading, spacing: 4) {
                ForEach(parts) { part in
                    HStack {
                        Text(part.name)
                        Text(part.id)
                            .font(.callout.monospaced())
                            .foregroundStyle(.secondary)
                        if part.variants > 0 {
                            Text("\(part.variants) 个变体")
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
            .padding(.top, 6)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .padding(16)
        .background(.fill.quinary, in: .rect(cornerRadius: 12))
    }
}
