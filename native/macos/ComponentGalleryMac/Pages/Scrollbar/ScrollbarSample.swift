import SwiftUI

/// 一个小滚动视图：内容是可视区域的 `pages` 倍，初始停在 `anchor`。
struct ScrollbarSample: View {
    let axis: Axis.Set
    let pages: Double
    let anchor: UnitPoint

    private let side = 96.0

    var body: some View {
        ScrollView(axis) {
            LinearGradient(colors: [.blue, .purple, .pink, .orange], startPoint: .topLeading, endPoint: .bottomTrailing)
                .frame(
                    width: axis == .horizontal ? side * pages : side,
                    height: axis == .vertical ? side * pages : side
                )
        }
        .defaultScrollAnchor(anchor)
        .scrollIndicators(.visible)
        .frame(width: side, height: side)
        .clipShape(.rect(cornerRadius: 6))
    }
}
