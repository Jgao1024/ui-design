import SwiftUI

/// 锁屏圆形小组件的半透明底（App 内拿不到 AccessoryWidgetBackground，用填充近似）。
struct LockWidgetCircleBackground: View {
    var body: some View {
        Circle()
            .fill(.white.opacity(0.18))
            .accessibilityHidden(true)
    }
}
