import SwiftUI

/// 带多个 Section 的侧边栏列表；第一个 Section 标题即 First Section: True。
struct SidebarSectionsList: View {
    let size: SidebarRowSize
    var height = 220.0

    @State private var selection: String? = "最近使用"

    var body: some View {
        List(selection: $selection) {
            Section("个人收藏") {
                Label("最近使用", systemImage: "clock").tag("最近使用")
                Label("应用程序", systemImage: "app.dashed").tag("应用程序")
                Label("桌面", systemImage: "menubar.dock.rectangle").tag("桌面")
                Label("下载", systemImage: "arrow.down.circle").tag("下载")
            }
            Section("iCloud") {
                Label("iCloud 云盘", systemImage: "icloud").tag("iCloud 云盘")
                Label("共享", systemImage: "folder.badge.person.crop").tag("共享")
            }
            Section("位置") {
                Label("Macintosh HD", systemImage: "internaldrive").tag("Macintosh HD")
                Label("网络", systemImage: "network").tag("网络")
            }
            Section("标签") {
                Label("红色", systemImage: "circle.fill").tag("红色")
                    .foregroundStyle(.red)
                Label("蓝色", systemImage: "circle.fill").tag("蓝色")
                    .foregroundStyle(.blue)
            }
        }
        .listStyle(.sidebar)
        .environment(\.sidebarRowSize, size)
        .frame(width: 230, height: height)
    }
}
