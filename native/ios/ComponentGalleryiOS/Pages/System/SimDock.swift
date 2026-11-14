import SwiftUI

/// 主屏幕底部的玻璃 Dock。
struct SimDock: View {
    let count: Int
    var iconSize: Double = 44

    var body: some View {
        HStack(spacing: iconSize * 0.4) {
            ForEach(0..<count, id: \.self) { index in
                let icon = SimIcons.icon(at: index)
                SimAppIcon(systemImage: icon.systemImage, tint: icon.tint, size: iconSize)
            }
        }
        .padding(iconSize * 0.3)
        .glassEffect(.regular, in: .rect(cornerRadius: iconSize * 0.6))
    }
}
