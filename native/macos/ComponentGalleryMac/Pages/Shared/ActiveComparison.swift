import SwiftUI

/// 同一组控件上下排列显示 Active: True 和 Active: False。
/// Active: False 用 `controlActiveState = .inactive` 模拟窗口未激活；系统控件不一定响应这个环境值。
struct ActiveComparison<Content: View>: View {
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            VStack(alignment: .leading, spacing: 8) {
                AxisLabel("Active: True")
                content
            }

            VStack(alignment: .leading, spacing: 8) {
                AxisLabel("Active: False（环境模拟；外观不变说明系统不支持，可切到别的 App 看真实未激活态）")
                content
                    .environment(\.controlActiveState, .inactive)
            }
        }
    }
}
