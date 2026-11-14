import SwiftUI

/// Materials 族：五种 `Material` 叠在彩色背景上。
struct MaterialsDemo: View {
    private let materials: [(name: String, code: String, material: Material)] = [
        ("Ultra Thick", ".ultraThickMaterial", .ultraThickMaterial),
        ("Thick", ".thickMaterial", .thickMaterial),
        ("Medium", ".regularMaterial", .regularMaterial),
        ("Thin", ".thinMaterial", .thinMaterial),
        ("Ultra Thin", ".ultraThinMaterial", .ultraThinMaterial),
    ]

    var body: some View {
        HStack(spacing: 16) {
            ForEach(materials, id: \.name) { entry in
                VStack(spacing: 6) {
                    ZStack {
                        WallpaperBackdrop()
                        Text("Aa")
                            .font(.largeTitle)
                            .bold()
                            .offset(x: -18, y: -18)
                        Rectangle()
                            .fill(entry.material)
                            .frame(width: 70, height: 70)
                            .offset(x: 10, y: 10)
                    }
                    .frame(width: 100, height: 100)
                    .clipShape(.rect(cornerRadius: 10))
                    Text(entry.name)
                        .font(.caption)
                    Text(entry.code)
                        .font(.caption.monospaced())
                        .foregroundStyle(.secondary)
                }
            }
        }
    }
}
