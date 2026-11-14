import SwiftUI

/// 模拟 Home 指示条。
struct SimHomeIndicator: View {
    var width: Double = 134

    var body: some View {
        Capsule()
            .fill(.primary)
            .frame(width: width, height: 5)
            .accessibilityHidden(true)
    }
}
