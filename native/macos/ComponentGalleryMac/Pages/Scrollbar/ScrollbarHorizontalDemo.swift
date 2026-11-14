import SwiftUI

/// Scrollbar - Horizontal 族：Page（行）× Position（列）。
struct ScrollbarHorizontalDemo: View {
    private let positions: [(name: String, anchor: UnitPoint)] = [("Leading", .leading), ("Center", .center), ("Trailing", .trailing)]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Grid(alignment: .center, horizontalSpacing: 20, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Page")
                    ForEach(positions, id: \.name) { position in
                        AxisLabel(position.name)
                    }
                }
                ForEach([2.0, 4.0, 8.0], id: \.self) { pages in
                    GridRow {
                        AxisLabel((pages).formatted(.percent))
                        ForEach(positions, id: \.name) { position in
                            ScrollbarSample(axis: .horizontal, pages: pages, anchor: position.anchor)
                        }
                    }
                }
            }
            ScrollbarNote()
        }
    }
}
