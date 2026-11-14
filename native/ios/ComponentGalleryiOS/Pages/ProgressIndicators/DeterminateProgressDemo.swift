import SwiftUI

/// Progress Bar - Determinate Linear：Value 100% 到 0%，每 10% 一个。
struct DeterminateProgressDemo: View {
    var body: some View {
        ForEach(Array(stride(from: 100, through: 0, by: -10)), id: \.self) { value in
            DemoCase(title: "Value: \(value)%") {
                ProgressView(value: Double(value), total: 100)
            }
        }
    }
}
