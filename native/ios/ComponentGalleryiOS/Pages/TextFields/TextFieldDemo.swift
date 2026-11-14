import SwiftUI

/// Text Field：Placeholder、Focused、Value Entered、Typing。
struct TextFieldDemo: View {
    @State private var empty = ""
    @State private var filled = "Apple Park"
    @State private var focusTarget = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        DemoCase(title: "State: Placeholder") {
            TextField("地址", text: $empty)
                .textFieldStyle(.roundedBorder)
        }
        DemoCase(title: "State: Value Entered") {
            TextField("地址", text: $filled)
                .textFieldStyle(.roundedBorder)
        }
        DemoCase(title: "State: Focused") {
            HStack {
                TextField("地址", text: $focusTarget)
                    .textFieldStyle(.roundedBorder)
                    .focused($isFocused)
                Button("聚焦", action: focus)
                    .buttonStyle(.bordered)
            }
        }
        InteractiveHint(text: "State: Typing：聚焦后输入文字即为 Typing 态")
    }

    /// 用按钮触发 @FocusState，避免一打开页面就弹出键盘。
    private func focus() {
        isFocused = true
    }
}
