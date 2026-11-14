import SwiftUI

/// 模拟锁屏：日期、大号时间、底部手电筒与相机按钮。
struct SimLockScreen: View {
    let width: Double
    let height: Double

    var body: some View {
        MockScreen(width: width, height: height) {
            ZStack {
                SimWallpaper(isDark: true)
                VStack(spacing: 4) {
                    Text("6月8日 星期一")
                        .font(.headline)
                    Text("9:41")
                        .font(.system(size: 80, weight: .bold, design: .rounded))
                    Spacer()
                    HStack {
                        SimLockButton(systemImage: "flashlight.off.fill", label: "手电筒")
                        Spacer()
                        SimLockButton(systemImage: "camera.fill", label: "相机")
                    }
                    SimHomeIndicator(width: 110)
                        .padding(.top, 12)
                }
                .foregroundStyle(.white)
                .padding(24)
            }
        }
    }
}
