import SwiftUI

/// 模拟主屏幕：壁纸、可选小组件、图标网格、玻璃 Dock、Home 指示条。
struct SimHomeScreen: View {
    let width: Double
    let height: Double
    let columns: Int
    var widget: SimWidgetSize?
    var maxWidth: Double = 360

    private var isPortrait: Bool { height > width }

    var body: some View {
        MockScreen(width: width, height: height, maxWidth: maxWidth) {
            ZStack {
                SimWallpaper()
                VStack(spacing: 14) {
                    Text("9:41")
                        .font(.caption)
                        .bold()
                        .frame(maxWidth: .infinity, alignment: .leading)
                    if let widget {
                        SimWidget(size: widget)
                            .frame(height: widget == .small ? 110 : 150)
                            .frame(maxWidth: widget == .small ? 140 : .infinity, alignment: .leading)
                    }
                    SimIconGrid(columns: columns, count: columns * (isPortrait ? (widget == nil ? 5 : 3) : 2), iconSize: 32)
                    Spacer(minLength: 0)
                    SimDock(count: min(columns, 4), iconSize: 32)
                    SimHomeIndicator(width: 90)
                }
                .padding(14)
            }
        }
    }
}
