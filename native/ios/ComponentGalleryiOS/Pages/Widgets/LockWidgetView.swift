import SwiftUI

/// 锁屏小组件：仪表用真实的 Gauge + accessory 样式，其余按 kit 版式模拟，放在深色壁纸上。
struct LockWidgetView: View {
    let solo: SoloComponent

    var body: some View {
        LockWidgetContent(name: solo.name)
            .foregroundStyle(.white)
            .frame(maxWidth: solo.w)
            .frame(height: solo.h)
            .padding(16)
            .background {
                SimWallpaper(isDark: true)
            }
            .clipShape(.rect(cornerRadius: 16))
            .environment(\.colorScheme, .dark)
    }
}
