import SwiftUI

/// Segmented Control：Size Small / Large × Is Enabled。
struct SegmentedControlDemo: View {
    var body: some View {
        DemoCase(title: "Size: Small · Is Enabled: True") {
            SegmentedSample(size: .small, isEnabled: true)
        }
        DemoCase(title: "Size: Small · Is Enabled: False") {
            SegmentedSample(size: .small, isEnabled: false)
        }
        DemoCase(title: "Size: Large · Is Enabled: True") {
            SegmentedSample(size: .large, isEnabled: true)
        }
        DemoCase(title: "Size: Large · Is Enabled: False") {
            SegmentedSample(size: .large, isEnabled: false)
        }
    }
}
