import SwiftUI

/// 模拟控制中心：模糊壁纸上的玻璃控制块。
struct SimControlCenter: View {
    let width: Double
    let height: Double

    var body: some View {
        MockScreen(width: width, height: height) {
            ZStack {
                SimWallpaper()
                    .blur(radius: 20)
                Grid(horizontalSpacing: 12, verticalSpacing: 12) {
                    GridRow {
                        SimControlTile(symbols: ["airplane", "antenna.radiowaves.left.and.right", "wifi", "personalhotspot"])
                        SimControlTile(symbols: ["play.fill"], title: "未在播放")
                    }
                    GridRow {
                        SimControlTile(symbols: ["lock.rotation"])
                        SimControlTile(symbols: ["moon.fill"], title: "专注模式")
                    }
                    GridRow {
                        SimControlTile(symbols: ["sun.max.fill"], title: "亮度")
                        SimControlTile(symbols: ["speaker.wave.2.fill"], title: "音量")
                    }
                    GridRow {
                        SimControlTile(symbols: ["flashlight.off.fill"])
                        SimControlTile(symbols: ["camera.fill"])
                    }
                }
                .padding(20)
            }
        }
    }
}
