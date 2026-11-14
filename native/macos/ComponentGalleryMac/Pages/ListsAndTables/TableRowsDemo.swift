import SwiftUI

/// Table Rows 族：Level 0–4 × Type（Selected + Active / Selected + Inactive / Alternating Row Color / Default）。
struct TableRowsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            AxisLabel("Alternating Row Color + Selected + Active（点一下表格让它获得焦点）")
            OutlineTable(alternatesRows: true)

            AxisLabel("Default + Selected + Inactive（controlActiveState = .inactive）")
            OutlineTable(alternatesRows: false)
                .environment(\.controlActiveState, .inactive)

            DemoNotes("Type: Selected + Active / Inactive —— 由表格是否拥有焦点、窗口是否激活决定；环境值模拟若无效，点别处让表格失焦即可看到 Inactive")
        }
    }
}
