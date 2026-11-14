import SwiftUI

/// 模拟 iPad 状态栏与菜单栏：Full Screen × Menu Expanded。
struct SimIPadStatusBar: View {
    let isFullScreen: Bool
    let isMenuExpanded: Bool

    var body: some View {
        HStack(spacing: 16) {
            SimIPadLeadingAccessories()
            if isMenuExpanded {
                HStack(spacing: 14) {
                    Text("文件")
                    Text("编辑")
                    Text("显示")
                    Text("窗口")
                    Text("帮助")
                }
                .font(.subheadline)
            }
            Spacer()
            SimStatusIcons()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 8)
        .background(isFullScreen ? AnyShapeStyle(.background) : AnyShapeStyle(.bar))
        .clipShape(.rect(cornerRadius: 10))
    }
}
