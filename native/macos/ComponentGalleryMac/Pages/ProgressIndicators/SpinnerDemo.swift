import SwiftUI

/// Circular - Indeterminate（Spinner）族：`ProgressView()` + `.controlSize`。
struct SpinnerDemo: View {
    var body: some View {
        HStack(spacing: 40) {
            VariantCell("Small") {
                ProgressView()
                    .controlSize(.small)
            }
            VariantCell("Large") {
                ProgressView()
                    .controlSize(.large)
            }
        }
    }
}
