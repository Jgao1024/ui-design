import SwiftUI

/// Header：Extra Prominent、Prominent、Nested。
struct HeaderDemo: View {
    var body: some View {
        List {
            Section {
                Text("最近添加")
            } header: {
                Text("Extra Prominent")
                    .font(.title2)
                    .bold()
                    .foregroundStyle(.primary)
                    .textCase(nil)
            }
            Section {
                Text("精选")
            } header: {
                Text("Prominent")
            }
            .headerProminence(.increased)
            Section {
                Text("子项")
            } header: {
                Text("Nested")
            }
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 380)
        UnreproducedList(items: [
            "Extra Prominent：系统没有对应的标题级别，用 .title2 粗体近似",
        ])
    }
}
