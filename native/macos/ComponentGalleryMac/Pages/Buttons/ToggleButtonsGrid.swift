import SwiftUI

/// On（行）× State（列）的 `.toggleStyle(.button)` 网格。
struct ToggleButtonsGrid: View {
    @State private var isOn = true
    @State private var isOff = false

    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 10) {
            GridRow {
                AxisLabel("On")
                AxisLabel("Idle")
                AxisLabel("Disabled")
                AxisLabel("Clicked（按住）")
            }
            GridRow {
                AxisLabel("True")
                Toggle("Label", isOn: $isOn)
                Toggle("Label", isOn: .constant(true))
                    .disabled(true)
                Toggle("Label", isOn: $isOn)
            }
            GridRow {
                AxisLabel("False")
                Toggle("Label", isOn: $isOff)
                Toggle("Label", isOn: .constant(false))
                    .disabled(true)
                Toggle("Label", isOn: $isOff)
            }
        }
        .toggleStyle(.button)
    }
}
