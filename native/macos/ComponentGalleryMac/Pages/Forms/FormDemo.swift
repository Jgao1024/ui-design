import SwiftUI

/// Form 独立组件：完整的分组表单 `Form` + `.formStyle(.grouped)`。
struct FormDemo: View {
    @State private var computerName = "Jgao 的 MacBook Pro"
    @State private var startsAtLogin = true
    @State private var appearance = "自动"
    @State private var fontSize = 13.0

    var body: some View {
        Form {
            Section("通用") {
                TextField("电脑名称", text: $computerName)
                Toggle("登录时打开", isOn: $startsAtLogin)
                Picker("外观", selection: $appearance) {
                    Text("浅色").tag("浅色")
                    Text("深色").tag("深色")
                    Text("自动").tag("自动")
                }
            }
            Section("文字") {
                LabeledContent("字号") {
                    Slider(value: $fontSize, in: 9...24)
                }
                LabeledContent("版本", value: "macOS 27.2")
            }
        }
        .formStyle(.grouped)
        .scrollDisabled(true)
        .frame(width: 460, height: 340)
    }
}
