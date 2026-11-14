import SwiftUI

/// 48 pt 的圆形玻璃按钮。
struct SmallGlassButton: View {
    let glass: Glass

    var body: some View {
        Image(systemName: "plus")
            .font(.title2)
            .frame(width: 48, height: 48)
            .glassEffect(glass.interactive(), in: .circle)
            .accessibilityLabel("添加")
    }
}
