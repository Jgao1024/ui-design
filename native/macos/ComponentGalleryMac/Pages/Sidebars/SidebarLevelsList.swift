import SwiftUI

/// 真实的侧边栏列表：Level 0–4 嵌套、选中行（Selected）、普通行（Idle）、禁用行（Disabled）。
struct SidebarLevelsList: View {
    let size: SidebarRowSize

    @State private var selection: String? = "Level 2"
    @State private var level0Expanded = true
    @State private var level1Expanded = true
    @State private var level2Expanded = true
    @State private var level3Expanded = true

    var body: some View {
        List(selection: $selection) {
            DisclosureGroup(isExpanded: $level0Expanded) {
                DisclosureGroup(isExpanded: $level1Expanded) {
                    DisclosureGroup(isExpanded: $level2Expanded) {
                        DisclosureGroup(isExpanded: $level3Expanded) {
                            Label("Level 4", systemImage: "doc").tag("Level 4")
                        } label: {
                            Label("Level 3", systemImage: "folder").tag("Level 3")
                        }
                    } label: {
                        Label("Level 2", systemImage: "folder").tag("Level 2")
                    }
                } label: {
                    Label("Level 1", systemImage: "folder").tag("Level 1")
                }
            } label: {
                Label("Level 0", systemImage: "folder").tag("Level 0")
            }
            Label("Idle", systemImage: "star").tag("Idle")
            Label("Disabled", systemImage: "nosign").tag("Disabled")
                .disabled(true)
        }
        .listStyle(.sidebar)
        .environment(\.sidebarRowSize, size)
        .frame(width: 230, height: 290)
    }
}
