import SwiftUI

/// 展开到 Level 4 的层级表格，默认选中 Level 2 那一行。
struct OutlineTable: View {
    let alternatesRows: Bool

    @State private var selection: FileRow.ID? = "页面"
    @State private var level0Expanded = true
    @State private var level1Expanded = true
    @State private var level2Expanded = true
    @State private var level3Expanded = true

    var body: some View {
        let project = FileRow.outline[0]
        let sources = project.children?[0] ?? project
        let pages = sources.children?[0] ?? sources
        let controls = pages.children?[0] ?? pages
        let file = controls.children?[0] ?? controls

        Table(of: FileRow.self, selection: $selection) {
            TableColumn("名称", value: \.name)
            TableColumn("种类", value: \.kind)
            TableColumn("大小", value: \.size)
        } rows: {
            DisclosureTableRow(project, isExpanded: $level0Expanded) {
                DisclosureTableRow(sources, isExpanded: $level1Expanded) {
                    DisclosureTableRow(pages, isExpanded: $level2Expanded) {
                        DisclosureTableRow(controls, isExpanded: $level3Expanded) {
                            TableRow(file)
                        }
                    }
                }
            }
            TableRow(FileRow.outline[2])
        }
        .alternatingRowBackgrounds(alternatesRows ? .enabled : .disabled)
        .frame(height: 190)
    }
}
