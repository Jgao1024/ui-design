import SwiftUI

/// `UtilityWindow` 的内容：顶部是 Utility Panel Tab Bar（图标分段控件），下面是检查器表单。
struct UtilityPanelContent: View {
    static let windowID = "utility-panel"

    @State private var tab = 0
    @State private var opacity = 0.8
    @State private var isLocked = false

    var body: some View {
        VStack(spacing: 0) {
            Picker("检查器", selection: $tab) {
                Label("文件", systemImage: "doc").tag(0)
                Label("历史", systemImage: "clock").tag(1)
                Label("帮助", systemImage: "questionmark.circle").tag(2)
            }
            .pickerStyle(.segmented)
            .labelStyle(.iconOnly)
            .labelsHidden()
            .padding(8)

            Form {
                LabeledContent("不透明度") {
                    Slider(value: $opacity)
                }
                Toggle("锁定", isOn: $isLocked)
            }
            .formStyle(.grouped)
        }
        .frame(minWidth: 260, minHeight: 240)
    }
}
