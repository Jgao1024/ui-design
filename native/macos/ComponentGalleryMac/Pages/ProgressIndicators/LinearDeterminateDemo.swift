import SwiftUI

/// Linear - Determinate 族：`ProgressView(value:)` + `.progressViewStyle(.linear)`，Size（行）× Percentage（列）。
struct LinearDeterminateDemo: View {
    var body: some View {
        ActiveComparison {
            Grid(alignment: .leading, horizontalSpacing: 16, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Size")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        AxisLabel(value.formatted(.percent))
                    }
                }
                GridRow {
                    AxisLabel("Medium")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        ProgressView(value: value)
                            .progressViewStyle(.linear)
                            .frame(width: 100)
                    }
                }
                GridRow {
                    AxisLabel("Small")
                    ForEach(ProgressValues.all, id: \.self) { value in
                        ProgressView(value: value)
                            .progressViewStyle(.linear)
                            .controlSize(.small)
                            .frame(width: 100)
                    }
                }
            }
        }
    }
}
