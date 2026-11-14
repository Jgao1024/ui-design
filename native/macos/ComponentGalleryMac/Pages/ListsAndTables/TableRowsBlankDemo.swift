import SwiftUI

/// Table Rows - Blank 族：没有数据时的空行，`.alternatingRowBackgrounds()` 开 / 关。
struct TableRowsBlankDemo: View {
    var body: some View {
        HStack(alignment: .top, spacing: 24) {
            VariantCell("Alternating Row: True") {
                Table([FileRow]()) {
                    TableColumn("名称", value: \.name)
                    TableColumn("种类", value: \.kind)
                }
                .alternatingRowBackgrounds()
                .frame(height: 130)
            }
            VariantCell("Alternating Row: False") {
                Table([FileRow]()) {
                    TableColumn("名称", value: \.name)
                    TableColumn("种类", value: \.kind)
                }
                .alternatingRowBackgrounds(.disabled)
                .frame(height: 130)
            }
        }
    }
}
