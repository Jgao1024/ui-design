import SwiftUI

/// Menu Background、Headers、Separators、Menu Items 共用：菜单的组成部分只能在打开的真实菜单里看到。
struct MenuPartDemo: View {
    let hint: LocalizedStringResource
    var notes: [LocalizedStringResource] = []

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 24) {
                VariantCell("Menu has Selection: False") {
                    SampleMenuButton(title: "打开菜单", hasSelection: false)
                }
                VariantCell("Menu has Selection: True") {
                    SampleMenuButton(title: "打开带勾选的菜单", hasSelection: true)
                }
            }
            InteractiveHint(text: hint)
            if !notes.isEmpty {
                DemoNotes(notes: notes)
            }
        }
    }
}
