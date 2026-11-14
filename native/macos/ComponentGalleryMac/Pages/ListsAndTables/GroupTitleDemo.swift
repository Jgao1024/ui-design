import SwiftUI

/// Group Title 独立组件：`List` 里 `Section` 的分组标题。
struct GroupTitleDemo: View {
    var body: some View {
        List {
            Section("Group Title") {
                ForEach(FileRow.samples) { row in
                    Text(row.name)
                }
            }
        }
        .listStyle(.inset)
        .frame(width: 320, height: 160)
    }
}
