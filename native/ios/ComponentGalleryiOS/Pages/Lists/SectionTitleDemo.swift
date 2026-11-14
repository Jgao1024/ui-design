import SwiftUI

/// Section Title：分组列表的分区标题。
struct SectionTitleDemo: View {
    var body: some View {
        List {
            Section("Section Title") {
                Text("第一行")
                Text("第二行")
            }
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 170)
    }
}
