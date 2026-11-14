import SwiftUI

/// Status Bar - iPhone：三个机型外观相同，只有灵动岛尺寸细微差别。另附一个真实状态栏显隐开关。
struct StatusBarIPhoneDemo: View {
    @State private var hidesRealStatusBar = false

    var body: some View {
        ForEach(["iPhone 17 Pro", "iPhone 18 Pro", "iPhone 18 Pro Max"], id: \.self) { model in
            DemoCase(title: "iPhone: \(model)") {
                SimIPhoneStatusBar()
                    .clipShape(.rect(cornerRadius: 12))
            }
        }
        Toggle("隐藏本 App 的真实状态栏", isOn: $hidesRealStatusBar)
            .toolbarVisibility(hidesRealStatusBar ? .hidden : .automatic, for: .statusBar)
        Text("真实状态栏只能用 .toolbarVisibility(_:for: .statusBar) 显隐，内容由系统绘制。")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
