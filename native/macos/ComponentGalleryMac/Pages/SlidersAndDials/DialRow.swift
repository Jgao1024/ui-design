import SwiftUI

/// Dial 的一行：Idle / Disabled / Clicked。
struct DialRow: View {
    @State private var idle = 0.3
    @State private var interactive = 0.7

    var body: some View {
        HStack(spacing: 32) {
            VariantCell("Idle") {
                DialView(value: $idle)
            }
            VariantCell("Disabled") {
                DialView(value: .constant(0.5))
                    .disabled(true)
            }
            VariantCell("Clicked（拖动）") {
                DialView(value: $interactive)
            }
        }
    }
}
