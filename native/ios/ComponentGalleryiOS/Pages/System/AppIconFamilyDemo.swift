import SwiftUI

/// App Icon 族：Custom Icon True / False。
struct AppIconFamilyDemo: View {
    var body: some View {
        HStack(spacing: 32) {
            DemoCase(title: "Custom Icon: True") {
                SimAppIcon(systemImage: "paintpalette.fill", isCustom: true, size: 72)
            }
            DemoCase(title: "Custom Icon: False") {
                SimAppIcon(systemImage: "gearshape.fill", tint: .gray, size: 72)
            }
        }
    }
}
