import SwiftUI

/// 模拟通知横幅；stackCount > 1 时在下方叠出卡片边缘。
struct SimNotification: View {
    var stackCount = 1
    var isExpanded = false

    var body: some View {
        VStack(spacing: 0) {
            SimNotificationCard(stackCount: stackCount, isExpanded: isExpanded)
            ForEach(1..<max(stackCount, 1), id: \.self) { layer in
                RoundedRectangle(cornerRadius: 22)
                    .fill(.ultraThinMaterial)
                    .frame(height: 10)
                    .padding(.horizontal, Double(layer) * 12)
                    .offset(y: -4)
                    .accessibilityHidden(true)
            }
        }
    }
}
