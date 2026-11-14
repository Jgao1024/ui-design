import SwiftUI

/// Home Screen Widget：Small、Medium、Large、Extra Large，按设计稿宽高比展示。
struct HomeWidgetFamilyDemo: View {
    let family: ComponentSet

    var body: some View {
        ForEach(family.kids) { kid in
            if let size = kid.values.first.flatMap(SimWidgetSize.init(figmaValue:)) {
                DemoCase(title: "Size: \(size.rawValue)") {
                    SimWidget(size: size)
                        .aspectRatio(kid.w / max(kid.h, 1), contentMode: .fit)
                        .frame(maxWidth: min(kid.w, 360))
                        .padding()
                        .background {
                            SimWallpaper()
                        }
                        .clipShape(.rect(cornerRadius: 20))
                }
            }
        }
    }
}
