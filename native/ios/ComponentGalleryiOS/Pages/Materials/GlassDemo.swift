import SwiftUI

/// Liquid Glass 各尺寸：Large（面板）、Medium（卡片）、Small（按钮，含 Active × Prominent）、Clear。
struct GlassDemo: View {
    let size: GlassDemoSize

    var body: some View {
        GlassEffectContainer {
            VStack(spacing: 16) {
                switch size {
                case .large:
                    GlassShape(title: "Regular · Large", glass: .regular, cornerRadius: 34, height: 180)
                case .medium:
                    GlassShape(title: "Regular · Medium", glass: .regular, cornerRadius: 24, height: 110)
                case .small:
                    HStack(spacing: 12) {
                        GlassShape(title: "默认", glass: .regular, cornerRadius: 22, height: 44)
                        GlassShape(title: "Active", glass: .regular.interactive(), cornerRadius: 22, height: 44)
                    }
                    HStack(spacing: 12) {
                        GlassShape(title: "Prominent", glass: .regular.tint(.accentColor), cornerRadius: 22, height: 44)
                        GlassShape(title: "Active + Prominent", glass: .regular.tint(.accentColor).interactive(), cornerRadius: 22, height: 44)
                    }
                case .clear:
                    GlassShape(title: "Clear", glass: .clear, cornerRadius: 24, height: 110)
                }
            }
        }
        .padding(24)
        .background {
            ColorfulBackdrop()
        }
        .clipShape(.rect(cornerRadius: 20))
        if size == .small {
            InteractiveHint(text: "Active: True：按住带 Active 的玻璃块，看按压时的高光与形变")
        }
    }
}
