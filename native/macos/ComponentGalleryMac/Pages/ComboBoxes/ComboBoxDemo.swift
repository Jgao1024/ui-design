import SwiftUI

/// Combo Box 族：`NSComboBox` 桥接。
struct ComboBoxDemo: View {
    private let fonts = ["SF Pro", "SF Mono", "New York", "Helvetica Neue"]

    @State private var idle = "SF Pro"
    @State private var interactive = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 32) {
                VariantCell("Idle") {
                    ComboBoxView(items: fonts, text: $idle)
                        .frame(width: 160)
                }
                VariantCell("Disabled") {
                    ComboBoxView(items: fonts, text: .constant("SF Mono"))
                        .frame(width: 160)
                        .disabled(true)
                }
                VariantCell("Field Clicked / Button Clicked") {
                    ComboBoxView(items: fonts, text: $interactive)
                        .frame(width: 160)
                }
            }
            InteractiveHint(text: "Field Clicked：点输入框；Button Clicked：按住右侧箭头")
            DemoNotes("State: Field Clicked、Button Clicked —— 交互态，无法静态强制")
        }
    }
}
