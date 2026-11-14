import SwiftUI

/// Scroll Edge Effect - Hard / Soft 族：Edge Top / Bottom。
struct ScrollEdgeEffectDemo: View {
    let style: ScrollEdgeEffectStyle

    var body: some View {
        HStack(alignment: .top, spacing: 24) {
            VariantCell("Edge: Top") {
                ScrollEdgeSample(style: style, edge: .top)
            }
            VariantCell("Edge: Bottom") {
                ScrollEdgeSample(style: style, edge: .bottom)
            }
        }
    }
}
