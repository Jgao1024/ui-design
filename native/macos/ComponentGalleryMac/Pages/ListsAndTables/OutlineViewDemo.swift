import SwiftUI

/// Outline View 独立组件：`Table(_:children:)` 生成的可展开大纲。
struct OutlineViewDemo: View {
    @State private var selection: FileRow.ID?

    var body: some View {
        Table(FileRow.outline, children: \.children, selection: $selection) {
            TableColumn("名称", value: \.name)
            TableColumn("种类", value: \.kind)
            TableColumn("大小", value: \.size)
        }
        .alternatingRowBackgrounds()
        .frame(height: 220)
    }
}
