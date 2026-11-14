import SwiftUI

/// Column Header 独立组件：`Table` 的列标题栏（第一列带排序指示器）。
struct ColumnHeaderDemo: View {
    var body: some View {
        SortableTable(ascending: false)
            .frame(maxWidth: 600)
    }
}
