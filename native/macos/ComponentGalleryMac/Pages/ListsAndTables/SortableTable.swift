import SwiftUI

/// 带排序指示器的 `Table`：点击列标题切换升序 / 降序。
struct SortableTable: View {
    @State private var sortOrder: [KeyPathComparator<FileRow>]

    init(ascending: Bool) {
        _sortOrder = State(initialValue: [KeyPathComparator(\FileRow.name, order: ascending ? .forward : .reverse)])
    }

    var body: some View {
        Table(FileRow.samples.sorted(using: sortOrder), sortOrder: $sortOrder) {
            TableColumn("名称", value: \.name)
            TableColumn("种类", value: \.kind)
            TableColumn("大小", value: \.size)
        }
        .frame(height: 150)
    }
}
