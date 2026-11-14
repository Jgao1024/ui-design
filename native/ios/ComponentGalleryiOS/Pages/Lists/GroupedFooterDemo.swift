import SwiftUI

/// Grouped Table Footer：分组列表的分区页脚。
struct GroupedFooterDemo: View {
    var body: some View {
        List {
            Section {
                Toggle("自动下载", isOn: .constant(true))
            } footer: {
                Text("在其他设备上购买的 App 会自动下载到这台设备。")
            }
        }
        .listStyle(.insetGrouped)
        .scrollDisabled(true)
        .frame(height: 150)
    }
}
