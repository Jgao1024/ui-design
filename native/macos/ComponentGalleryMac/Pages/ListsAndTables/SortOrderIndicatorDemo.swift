import SwiftUI

/// Sort Order Indicator 族：`Table(sortOrder:)` 列标题上的升降序箭头。
struct SortOrderIndicatorDemo: View {
    var body: some View {
        HStack(alignment: .top, spacing: 24) {
            VariantCell("Ascending") {
                SortableTable(ascending: true)
            }
            VariantCell("Descending") {
                SortableTable(ascending: false)
            }
        }
    }
}
