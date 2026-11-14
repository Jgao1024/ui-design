import SwiftUI

/// Progress Bar - Indeterminate Circular（Spinner）：Small、Regular、Large。
struct SpinnerDemo: View {
    var body: some View {
        HStack(spacing: 40) {
            DemoCase(title: "Small") {
                ProgressView().controlSize(.small)
            }
            DemoCase(title: "Regular") {
                ProgressView().controlSize(.regular)
            }
            DemoCase(title: "Large") {
                ProgressView().controlSize(.large)
            }
        }
    }
}
