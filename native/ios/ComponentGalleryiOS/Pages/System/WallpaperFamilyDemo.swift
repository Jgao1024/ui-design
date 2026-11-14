import SwiftUI

/// Wallpapers 族：Mode 轴跟随全局明暗；iPhone Duo 的 Style 轴（Star White / Night Sky）逐个展示。
struct WallpaperFamilyDemo: View {
    let family: ComponentSet

    var body: some View {
        if family.appearanceAxis != nil, let kid = family.kids.first {
            MockScreen(width: kid.w, height: kid.h, maxWidth: 260) {
                SimWallpaper()
            }
        } else {
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: 12)], spacing: 12) {
                ForEach(family.kids) { kid in
                    DemoCase(title: "\(kid.values.joined(separator: " · "))") {
                        MockScreen(width: kid.w, height: kid.h, maxWidth: 200, cornerRadius: 18) {
                            SimWallpaper(isDark: kid.values.contains("Night Sky"))
                        }
                    }
                }
            }
        }
    }
}
