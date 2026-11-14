import SwiftUI

/// Color Picker 族：`ColorPicker` 的 Idle / Disabled / Selected。
struct ColorPickerDemo: View {
    @State private var idle = Color.orange
    @State private var interactive = Color.green

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Idle") {
                    ColorPicker("颜色", selection: $idle)
                        .labelsHidden()
                }
                VariantCell("Disabled") {
                    ColorPicker("颜色", selection: .constant(Color.purple))
                        .labelsHidden()
                        .disabled(true)
                }
                VariantCell("Selected（点击打开颜色面板）") {
                    ColorPicker("颜色", selection: $interactive)
                        .labelsHidden()
                }
            }
            InteractiveHint(text: "Selected 是颜色面板打开时的状态，请点击色块")
            DemoNotes("State: Selected —— 只有颜色面板打开时出现，无法静态强制")
        }
    }
}
