import SwiftUI

/// Liquid Glass - Small 族：48 pt 圆形玻璃，State Default（`.regular`）/ Primary（`.regular.tint(.accentColor)`）× Active。
struct LiquidGlassSmallDemo: View {
    var body: some View {
        ActiveComparison {
            HStack(spacing: 24) {
                VariantCell("State: Default") {
                    SmallGlassButton(glass: .regular)
                }
                VariantCell("State: Primary") {
                    SmallGlassButton(glass: .regular.tint(.accentColor))
                }
            }
            .padding(16)
            .background { WallpaperBackdrop() }
            .clipShape(.rect(cornerRadius: 12))
        }
    }
}
