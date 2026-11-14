import SwiftUI

/// Section Header 族：Size × First Section（第一个 / 后续 Section 标题）× Active。
struct SectionHeaderDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ActiveComparison {
                HStack(alignment: .top, spacing: 16) {
                    ForEach(SidebarSizes.all, id: \.name) { entry in
                        VariantCell("Size: \(entry.name)") {
                            SidebarSectionsList(size: entry.size)
                        }
                    }
                }
            }
            Text("「个人收藏」是 First Section: True，其后的标题是 First Section: False。")
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }
}
