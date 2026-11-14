import SwiftUI

/// 工具栏 Pop-Up Button 族：`Picker` + `.pickerStyle(.menu)`。
struct ToolbarPopUpDemo: View {
    @State private var sortOrder = "中"

    var body: some View {
        ToolbarFamilyDemo {
            HStack(spacing: 24) {
                VariantCell("Idle") {
                    SizePicker(selection: $sortOrder)
                        .labelsHidden()
                }
                VariantCell("Disabled") {
                    SizePicker(selection: .constant("小"))
                        .labelsHidden()
                        .disabled(true)
                }
            }
        }
    }
}
