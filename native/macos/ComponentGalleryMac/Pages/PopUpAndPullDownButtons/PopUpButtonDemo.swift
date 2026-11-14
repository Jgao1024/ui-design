import SwiftUI

/// Pop-Up Button 族：`Picker` + `.pickerStyle(.menu)`，Show Label（行）× State（列）。
struct PopUpButtonDemo: View {
    @State private var withLabel = "中"
    @State private var withoutLabel = "中"

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Grid(alignment: .leading, horizontalSpacing: 24, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Show Label")
                    AxisLabel("Idle")
                    AxisLabel("Disabled")
                    AxisLabel("Clicked（点击展开）")
                }
                GridRow {
                    AxisLabel("True")
                    SizePicker(selection: $withLabel)
                    SizePicker(selection: .constant("小"))
                        .disabled(true)
                    SizePicker(selection: $withLabel)
                }
                GridRow {
                    AxisLabel("False")
                    SizePicker(selection: $withoutLabel)
                        .labelsHidden()
                    SizePicker(selection: .constant("小"))
                        .labelsHidden()
                        .disabled(true)
                    SizePicker(selection: $withoutLabel)
                        .labelsHidden()
                }
            }
            InteractiveHint()
            DemoNotes("State: Clicked —— 交互态，点击按钮即展开真实菜单")
        }
    }
}
