import SwiftUI

/// 模拟 iPad 状态栏左侧：时间与日期。
struct SimIPadLeadingAccessories: View {
    var body: some View {
        HStack(spacing: 6) {
            Text("9:41")
                .font(.subheadline)
                .bold()
            Text("6月8日 周一")
                .font(.subheadline)
        }
    }
}
