import SwiftUI

/// Toggle - Switch：Is On × Is Enabled 四种静态组合，Pressed 为交互态。
struct ToggleDemo: View {
    @State private var on = true
    @State private var off = false

    var body: some View {
        DemoCase(title: "Is On: True · Is Enabled: True") {
            Toggle("Wi-Fi", isOn: $on)
        }
        DemoCase(title: "Is On: False · Is Enabled: True") {
            Toggle("蓝牙", isOn: $off)
        }
        DemoCase(title: "Is On: True · Is Enabled: False") {
            Toggle("飞行模式", isOn: .constant(true))
                .disabled(true)
        }
        DemoCase(title: "Is On: False · Is Enabled: False") {
            Toggle("个人热点", isOn: .constant(false))
                .disabled(true)
        }
        InteractiveHint(text: "State: Pressed：交互态，请手动按住开关")
    }
}
