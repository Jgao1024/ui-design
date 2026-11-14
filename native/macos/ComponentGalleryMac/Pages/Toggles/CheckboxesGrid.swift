import SwiftUI

/// Selection（行）× State（列）的复选框网格。Mixed 用 `Toggle(sources:isOn:)`：子项不一致时显示混合态。
struct CheckboxesGrid: View {
    @State private var on = true
    @State private var off = false
    @State private var mixedSources = [true, false]

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 32, verticalSpacing: 10) {
            GridRow {
                AxisLabel("Selection")
                AxisLabel("Idle")
                AxisLabel("Disabled")
                AxisLabel("Clicked（按住）")
            }
            GridRow {
                AxisLabel("On")
                Toggle("Label", isOn: $on)
                Toggle("Label", isOn: .constant(true))
                    .disabled(true)
                Toggle("Label", isOn: $on)
            }
            GridRow {
                AxisLabel("Mixed")
                Toggle("Label", sources: $mixedSources, isOn: \.self)
                Toggle("Label", sources: $mixedSources, isOn: \.self)
                    .disabled(true)
                Toggle("Label", sources: $mixedSources, isOn: \.self)
            }
            GridRow {
                AxisLabel("Off")
                Toggle("Label", isOn: $off)
                Toggle("Label", isOn: .constant(false))
                    .disabled(true)
                Toggle("Label", isOn: $off)
            }
        }
        .toggleStyle(.checkbox)
    }
}
