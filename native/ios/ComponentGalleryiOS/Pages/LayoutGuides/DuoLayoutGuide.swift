import SwiftUI

/// iPhone Duo 布局参考示意：按名称解析 内屏 / 外屏、是否半折、是否带 sheet，按设计尺寸画出安全区与折痕。
struct DuoLayoutGuide: View {
    let solo: SoloComponent

    private var isInner: Bool { solo.name.contains("Inner") }
    private var isFolded: Bool { solo.name.contains("Folded") }
    private var hasSheet: Bool { solo.name.contains("Sheets") }

    var body: some View {
        MockScreen(width: solo.w, height: solo.h, maxWidth: 320, cornerRadius: 24) {
            ZStack {
                Rectangle()
                    .fill(.background.secondary)

                // 安全区：四周留出状态栏、Home 指示条与圆角的示意边距。
                RoundedRectangle(cornerRadius: 12)
                    .strokeBorder(.green, style: StrokeStyle(lineWidth: 1.5, dash: [5]))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 24)

                if isInner {
                    Rectangle()
                        .fill(isFolded ? AnyShapeStyle(.orange.opacity(0.35)) : AnyShapeStyle(.orange.opacity(0.15)))
                        .frame(width: isFolded ? 18 : 4)
                        .accessibilityLabel(isFolded ? "半折状态的折痕区域" : "折痕")
                }

                if hasSheet {
                    UnevenRoundedRectangle(topLeadingRadius: 20, topTrailingRadius: 20)
                        .fill(.background)
                        .shadow(radius: 8)
                        .padding(.top, isInner ? 60 : 40)
                        .padding(.horizontal, isInner ? 40 : 0)
                }
            }
        }
        LabeledContent("图例") {
            Text("绿色虚线：安全区 · 橙色：折痕")
        }
        .font(.caption)
        .foregroundStyle(.secondary)
    }
}
