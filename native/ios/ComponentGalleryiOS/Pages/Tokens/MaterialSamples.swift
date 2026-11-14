import SwiftUI

/// 彩色底图上的系统 Material 与 `.glassEffect` 实物。
struct MaterialSamples: View {
    var body: some View {
        ZStack {
            ColorfulBackdrop()
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 96), spacing: 12)], spacing: 12) {
                MaterialTile(title: ".ultraThinMaterial", material: .ultraThinMaterial)
                MaterialTile(title: ".thinMaterial", material: .thinMaterial)
                MaterialTile(title: ".regularMaterial", material: .regularMaterial)
                MaterialTile(title: ".thickMaterial", material: .thickMaterial)
                MaterialTile(title: ".ultraThickMaterial", material: .ultraThickMaterial)
                MaterialTile(title: ".bar", material: .bar)
                GlassTile(title: ".glassEffect(.regular)", glass: .regular)
                GlassTile(title: ".glassEffect(.clear)", glass: .clear)
                GlassTile(title: ".regular.tint(.blue)", glass: .regular.tint(.blue))
            }
            .padding()
        }
        .clipShape(.rect(cornerRadius: 20))
    }
}
