import SwiftUI

/// 模拟 iPhone 状态栏：左侧时间、中间灵动岛、右侧图标。
struct SimIPhoneStatusBar: View {
    var body: some View {
        HStack {
            Text("9:41")
                .font(.headline)
                .frame(maxWidth: .infinity)
            Capsule()
                .fill(.black)
                .frame(width: 124, height: 36)
                .accessibilityHidden(true)
            SimStatusIcons()
                .frame(maxWidth: .infinity)
        }
        .padding(.vertical, 12)
        .frame(maxWidth: .infinity)
        .background(.background)
    }
}
