import SwiftUI

/// State（列）的单选组：每组两个选项，一个 On、一个 Off。
struct RadioButtonsGrid: View {
    @State private var idle = 0
    @State private var interactive = 0

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 40, verticalSpacing: 10) {
            GridRow {
                AxisLabel("Idle")
                AxisLabel("Disabled")
                AxisLabel("Clicked（按住）")
            }
            GridRow {
                RadioPair(selection: $idle)
                RadioPair(selection: .constant(0))
                    .disabled(true)
                RadioPair(selection: $interactive)
            }
        }
    }
}
