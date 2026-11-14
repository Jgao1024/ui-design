import SwiftUI

/// Value（行）× State（列）的滑块网格。
struct SliderGrid: View {
    let showsTicks: Bool
    let isCenterBiased: Bool

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 8) {
            GridRow {
                AxisLabel("Value")
                AxisLabel("Idle")
                AxisLabel("Disabled")
                AxisLabel("Clicked（拖动）")
            }
            ForEach(ProgressValues.all, id: \.self) { value in
                GridRow {
                    AxisLabel(value.formatted(.percent))
                    SliderSample(value: value, showsTicks: showsTicks, isCenterBiased: isCenterBiased)
                    SliderSample(value: value, showsTicks: showsTicks, isCenterBiased: isCenterBiased)
                        .disabled(true)
                    SliderSample(value: value, showsTicks: showsTicks, isCenterBiased: isCenterBiased)
                }
            }
        }
    }
}
