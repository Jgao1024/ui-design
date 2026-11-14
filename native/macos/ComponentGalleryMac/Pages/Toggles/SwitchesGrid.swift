import SwiftUI

/// Selection（行）× State（列）的开关网格。
struct SwitchesGrid: View {
    @State private var on = true
    @State private var off = false

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
                Toggle("开关", isOn: $on)
                Toggle("开关", isOn: .constant(true))
                    .disabled(true)
                Toggle("开关", isOn: $on)
            }
            GridRow {
                AxisLabel("Off")
                Toggle("开关", isOn: $off)
                Toggle("开关", isOn: .constant(false))
                    .disabled(true)
                Toggle("开关", isOn: $off)
            }
        }
        .toggleStyle(.switch)
        .labelsHidden()
    }
}
