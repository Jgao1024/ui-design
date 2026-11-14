import SwiftUI

/// 在一个类型里按模式切换系统的三种 LabelStyle，图标模式仍保留文字供 VoiceOver 朗读。
struct DemoLabelStyle: LabelStyle {
    let mode: DemoLabelMode

    func makeBody(configuration: Configuration) -> some View {
        switch mode {
        case .iconOnly:
            Label(configuration).labelStyle(.iconOnly)
        case .titleOnly:
            Label(configuration).labelStyle(.titleOnly)
        case .titleAndIcon:
            Label(configuration).labelStyle(.titleAndIcon)
        }
    }
}
