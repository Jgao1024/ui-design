import SwiftUI

/// Style（行）× State（列）的按钮网格。
struct ButtonsGrid: View {
    var body: some View {
        Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 10) {
            GridRow {
                AxisLabel("Style")
                AxisLabel("Idle")
                AxisLabel("Disabled")
                AxisLabel("Clicked（按住）")
            }
            ForEach(ButtonSample.allCases) { sample in
                GridRow {
                    VStack(alignment: .leading) {
                        Text(sample.figmaName)
                        Text(sample.code)
                            .font(.caption.monospaced())
                            .foregroundStyle(.secondary)
                    }
                    SampleButton(sample: sample)
                    SampleButton(sample: sample)
                        .disabled(true)
                    SampleButton(sample: sample)
                }
            }
        }
    }
}
