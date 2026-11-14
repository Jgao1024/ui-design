import SwiftUI

/// Circular - Determinate 族：`ProgressView(value:)` + `.progressViewStyle(.circular)`，Size（行）× Progress（列）。
struct CircularDeterminateDemo: View {
    var body: some View {
        ActiveComparison {
            Grid(alignment: .center, horizontalSpacing: 28, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Size")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        AxisLabel(value.formatted(.percent))
                    }
                }
                GridRow {
                    AxisLabel("Large")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        ProgressView(value: value)
                            .progressViewStyle(.circular)
                            .controlSize(.large)
                    }
                }
                GridRow {
                    AxisLabel("Small")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        ProgressView(value: value)
                            .progressViewStyle(.circular)
                            .controlSize(.small)
                    }
                }
            }
        }
    }
}
