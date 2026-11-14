import SwiftUI

/// Sidebar Row：State（Default / Selected / Disabled / Disclosable）× Indent Level 0–2。
struct SidebarRowDemo: View {
    @State private var selection: String? = "Selected"
    @State private var isLevel0Expanded = true
    @State private var isLevel1Expanded = true

    var body: some View {
        List(selection: $selection) {
            Label("Default · Indent 0", systemImage: "folder").tag("Default")
            Label("Selected · Indent 0", systemImage: "folder").tag("Selected")
            Label("Disabled · Indent 0", systemImage: "folder")
                .tag("Disabled")
                .disabled(true)
            DisclosureGroup(isExpanded: $isLevel0Expanded) {
                Label("Default · Indent 1", systemImage: "doc").tag("Indent1")
                DisclosureGroup(isExpanded: $isLevel1Expanded) {
                    Label("Default · Indent 2", systemImage: "doc").tag("Indent2")
                } label: {
                    Label("Disclosable · Indent 1", systemImage: "folder")
                }
            } label: {
                Label("Disclosable · Indent 0", systemImage: "folder")
            }
        }
        .listStyle(.sidebar)
        .scrollDisabled(true)
        .frame(height: 340)
        Text("Indent Level 由 DisclosureGroup 嵌套产生。")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
