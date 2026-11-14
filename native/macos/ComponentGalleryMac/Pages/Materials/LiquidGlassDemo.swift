import SwiftUI

/// Liquid Glass - Large / Medium 族：`.glassEffect(_:in:)` 的 `.regular` 和 `.clear` 两种玻璃。
struct LiquidGlassDemo: View {
    private let cornerRadius = 28.0

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 24) {
                VariantCell(".regular") {
                    GlassSwatch(glass: .regular, cornerRadius: cornerRadius)
                }
                VariantCell(".clear") {
                    GlassSwatch(glass: .clear, cornerRadius: cornerRadius)
                }
            }
            DemoNotes("Large 与 Medium 的区别 —— SwiftUI 的 Glass 只有 .regular / .clear / .identity，折射强度由系统按尺寸自动调整，不能单独指定 Large 或 Medium")
        }
    }
}
