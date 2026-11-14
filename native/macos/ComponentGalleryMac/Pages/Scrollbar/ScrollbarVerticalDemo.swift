import SwiftUI

/// Scrollbar - Vertical 族：Page Height（行）× Position（列）。
struct ScrollbarVerticalDemo: View {
    private let positions: [(name: String, anchor: UnitPoint)] = [("Top", .top), ("Middle", .center), ("Bottom", .bottom)]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Grid(alignment: .center, horizontalSpacing: 20, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Page Height")
                    ForEach(positions, id: \.name) { position in
                        AxisLabel(position.name)
                    }
                }
                ForEach([2.0, 4.0, 8.0], id: \.self) { pages in
                    GridRow {
                        AxisLabel("x \(Int(pages))")
                        ForEach(positions, id: \.name) { position in
                            ScrollbarSample(axis: .vertical, pages: pages, anchor: position.anchor)
                        }
                    }
                }
            }
            ScrollbarNote()
        }
    }
}
