import SwiftUI

/// 模拟 iPhone Duo 外屏摄像头开孔。
struct SimOuterLens: View {
    var body: some View {
        Circle()
            .fill(.black)
            .overlay {
                Circle()
                    .fill(Color(hex: "#1B2A4A"))
                    .padding(28)
            }
            .overlay {
                Circle()
                    .stroke(.gray.opacity(0.6), lineWidth: 3)
                    .padding(6)
            }
            .frame(width: 96, height: 96)
            .accessibilityLabel("外屏镜头")
    }
}
