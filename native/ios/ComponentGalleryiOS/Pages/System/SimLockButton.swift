import SwiftUI

/// 锁屏底部的圆形玻璃按钮。
struct SimLockButton: View {
    let systemImage: String
    let label: LocalizedStringResource

    var body: some View {
        Image(systemName: systemImage)
            .font(.title3)
            .frame(width: 50, height: 50)
            .glassEffect(.regular, in: .circle)
            .accessibilityLabel(Text(label))
    }
}
