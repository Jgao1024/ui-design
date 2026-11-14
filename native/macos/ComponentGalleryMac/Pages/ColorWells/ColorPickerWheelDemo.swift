import SwiftUI

/// Color Picker - Wheel 族：`ColorPicker`，点击后打开系统颜色面板。
struct ColorPickerWheelDemo: View {
    @State private var unselected = Color.clear
    @State private var selected = Color.blue

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Color Selected: False") {
                    ColorPicker("颜色", selection: $unselected)
                        .labelsHidden()
                }
                VariantCell("Color Selected: True") {
                    ColorPicker("颜色", selection: $selected)
                        .labelsHidden()
                }
            }
            DemoNotes("色轮按钮的独立外观 —— SwiftUI 的 ColorPicker 只有一种系统外观，不能单独指定为色轮按钮；False 用透明色近似")
        }
    }
}
