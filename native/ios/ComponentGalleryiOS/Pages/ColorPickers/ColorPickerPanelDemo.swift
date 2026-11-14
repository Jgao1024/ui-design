import SwiftUI

/// 系统颜色面板：点击 ColorPicker 色块弹出。
struct ColorPickerPanelDemo: View {
    let note: LocalizedStringResource

    @State private var color = Color.teal

    var body: some View {
        ColorPicker("选择颜色", selection: $color, supportsOpacity: true)
        InteractiveHint(text: note)
    }
}
