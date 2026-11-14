import SwiftUI

/// 模拟 App 图标：圆角方块 + SF Symbol。Custom Icon 用多色渐变，系统图标用单色。
struct SimAppIcon: View {
    var systemImage = "star.fill"
    var tint: Color = .blue
    var isCustom = false
    var size: Double = 60
    var badge: Int?

    var body: some View {
        RoundedRectangle(cornerRadius: size * 0.225)
            .fill(isCustom
                  ? AnyShapeStyle(LinearGradient(colors: [.orange, .pink, .purple], startPoint: .topLeading, endPoint: .bottomTrailing))
                  : AnyShapeStyle(tint.gradient))
            .frame(width: size, height: size)
            .overlay {
                Image(systemName: systemImage)
                    .font(.system(size: size * 0.45))
                    .foregroundStyle(.white)
            }
            .overlay(alignment: .topTrailing) {
                if let badge {
                    Text("\(badge)")
                        .font(.system(size: size * 0.24))
                        .bold()
                        .foregroundStyle(.white)
                        .padding(.horizontal, size * 0.1)
                        .frame(minWidth: size * 0.36, minHeight: size * 0.36)
                        .background(.red, in: .capsule)
                        .offset(x: size * 0.12, y: -size * 0.12)
                }
            }
            .accessibilityElement(children: .ignore)
            .accessibilityLabel("App 图标")
    }
}
