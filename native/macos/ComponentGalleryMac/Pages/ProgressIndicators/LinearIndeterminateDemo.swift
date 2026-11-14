import SwiftUI

/// Linear - Indeterminate 族：`ProgressView()` + `.progressViewStyle(.linear)`。
struct LinearIndeterminateDemo: View {
    var body: some View {
        ActiveComparison {
            HStack(spacing: 40) {
                VariantCell("Medium") {
                    ProgressView()
                        .progressViewStyle(.linear)
                        .frame(width: 160)
                }
                VariantCell("Small") {
                    ProgressView()
                        .progressViewStyle(.linear)
                        .controlSize(.small)
                        .frame(width: 160)
                }
            }
        }
    }
}
