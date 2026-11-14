import SwiftUI

/// 160×160 的玻璃块，下面垫壁纸和文字，让折射效果可见。
struct GlassSwatch: View {
    let glass: Glass
    let cornerRadius: Double

    var body: some View {
        ZStack {
            WallpaperBackdrop()
            Text("Liquid\nGlass")
                .font(.largeTitle)
                .bold()
                .multilineTextAlignment(.center)
            Color.clear
                .frame(width: 120, height: 120)
                .glassEffect(glass, in: .rect(cornerRadius: cornerRadius))
        }
        .frame(width: 160, height: 160)
        .clipShape(.rect(cornerRadius: 12))
    }
}
