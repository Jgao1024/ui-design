import SwiftUI

/// 主屏幕图标网格。
struct SimIconGrid: View {
    let columns: Int
    let count: Int
    var iconSize: Double = 44

    var body: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: columns), spacing: iconSize * 0.4) {
            ForEach(0..<count, id: \.self) { index in
                let icon = SimIcons.icon(at: index)
                SimAppIcon(systemImage: icon.systemImage, tint: icon.tint, size: iconSize)
            }
        }
    }
}
