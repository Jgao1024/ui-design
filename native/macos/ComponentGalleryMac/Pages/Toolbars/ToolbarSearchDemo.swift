import SwiftUI

/// 工具栏 Search 族：真实的 `.searchable` 在示例窗口里；页内用搜索框近似展示各状态。
struct ToolbarSearchDemo: View {
    @State private var placeholder = ""
    @State private var value = "Liquid Glass"
    @FocusState private var focusedCell: SearchFieldCell?

    var body: some View {
        ToolbarFamilyDemo(notes: [
            "State: Focused、Typing —— 在示例窗口的搜索框里点击并输入即可看到",
            "整体外观 —— 真正的搜索框只能由 .searchable 放进工具栏，页内胶囊底色是自绘近似",
        ]) {
            HStack(spacing: 16) {
                VariantCell("Placeholder") {
                    SearchFieldImitation(text: $placeholder, focus: $focusedCell, cell: .idleEmpty)
                }
                VariantCell("Value") {
                    SearchFieldImitation(text: $value, focus: $focusedCell, cell: .idleText)
                }
                VariantCell("Placeholder + Disabled") {
                    SearchFieldImitation(text: .constant(""), focus: $focusedCell, cell: nil)
                        .disabled(true)
                }
                VariantCell("Value + Disabled") {
                    SearchFieldImitation(text: .constant("Liquid Glass"), focus: $focusedCell, cell: nil)
                        .disabled(true)
                }
            }
        }
    }
}
