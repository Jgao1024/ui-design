import SwiftUI

/// Search Field 族：Text（行）× State（列）。真实搜索框（`.searchable`）在示例窗口的工具栏里。
struct SearchFieldDemo: View {
    @State private var emptyIdle = ""
    @State private var textIdle = "Liquid Glass"
    @State private var emptyFocused = ""
    @State private var textFocused = "Liquid Glass"
    @FocusState private var focusedCell: SearchFieldCell?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            OpenDemoWindowButton(config: WindowDemoConfig(style: .unified))
            Text("示例窗口工具栏右侧是 `.searchable` 生成的真实搜索框。")
                .font(.callout)
                .foregroundStyle(.secondary)

            Grid(alignment: .leading, horizontalSpacing: 24, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Text")
                    AxisLabel("Idle")
                    AxisLabel("Focused")
                    AxisLabel("Disabled")
                }
                GridRow {
                    AxisLabel("False")
                    SearchFieldImitation(text: $emptyIdle, focus: $focusedCell, cell: .idleEmpty)
                    FocusableCell(action: focusEmpty) {
                        SearchFieldImitation(text: $emptyFocused, focus: $focusedCell, cell: .focusedEmpty)
                    }
                    SearchFieldImitation(text: .constant(""), focus: $focusedCell, cell: nil)
                        .disabled(true)
                }
                GridRow {
                    AxisLabel("True")
                    SearchFieldImitation(text: $textIdle, focus: $focusedCell, cell: .idleText)
                    FocusableCell(action: focusText) {
                        SearchFieldImitation(text: $textFocused, focus: $focusedCell, cell: .focusedText)
                    }
                    SearchFieldImitation(text: .constant("Liquid Glass"), focus: $focusedCell, cell: nil)
                        .disabled(true)
                }
            }

            DemoNotes(
                "整体外观 —— macOS 上真正的搜索框只能由 .searchable 放进工具栏或侧边栏；页内胶囊底色是自绘近似，真实外观看示例窗口",
                "State: Focused —— 用 @FocusState 聚焦；为了不抢走 ← → 翻页的焦点，改为点「聚焦」按钮触发"
            )
        }
    }

    private func focusEmpty() {
        focusedCell = .focusedEmpty
    }

    private func focusText() {
        focusedCell = .focusedText
    }
}
