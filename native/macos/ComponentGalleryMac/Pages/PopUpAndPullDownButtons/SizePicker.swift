import SwiftUI

/// 演示用的弹出按钮（Pop-Up Button）。
struct SizePicker: View {
    @Binding var selection: String

    var body: some View {
        Picker("字号", selection: $selection) {
            Text("小").tag("小")
            Text("中").tag("中")
            Text("大").tag("大")
        }
        .pickerStyle(.menu)
        .fixedSize()
    }
}
