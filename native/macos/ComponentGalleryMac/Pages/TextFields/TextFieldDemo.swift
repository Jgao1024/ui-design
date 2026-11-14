import SwiftUI

/// Text Field 族：`TextField` + `.textFieldStyle(.roundedBorder)`，Show Text（行）× State（列）。
struct TextFieldDemo: View {
    @State private var emptyIdle = ""
    @State private var textIdle = "Label"
    @State private var emptyFocused = ""
    @State private var textFocused = "Label"
    @FocusState private var focusedCell: TextFieldCell?

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Grid(alignment: .leading, horizontalSpacing: 24, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Show Text")
                    AxisLabel("Idle")
                    AxisLabel("Focused")
                    AxisLabel("Disabled")
                }
                GridRow {
                    AxisLabel("False（占位文字）")
                    TextField("Placeholder", text: $emptyIdle)
                    FocusableCell(action: focusPlaceholder) {
                        TextField("Placeholder", text: $emptyFocused)
                            .focused($focusedCell, equals: .placeholder)
                    }
                    TextField("Placeholder", text: .constant(""))
                        .disabled(true)
                }
                GridRow {
                    AxisLabel("True")
                    TextField("Placeholder", text: $textIdle)
                    FocusableCell(action: focusText) {
                        TextField("Placeholder", text: $textFocused)
                            .focused($focusedCell, equals: .text)
                    }
                    TextField("Placeholder", text: .constant("Label"))
                        .disabled(true)
                }
            }
            .textFieldStyle(.roundedBorder)
            .frame(maxWidth: 600)

            DemoNotes("State: Focused —— 用 @FocusState 聚焦；为了不抢走 ← → 翻页的焦点，改为点「聚焦」按钮触发")
        }
    }

    private func focusPlaceholder() {
        focusedCell = .placeholder
    }

    private func focusText() {
        focusedCell = .text
    }
}
