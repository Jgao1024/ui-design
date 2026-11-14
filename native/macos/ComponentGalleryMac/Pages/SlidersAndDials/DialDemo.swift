import SwiftUI

/// Dial (Circular Slider) 族：Context × State。
struct DialDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            AxisLabel("Context: Content Area")
            DialRow()

            AxisLabel("Context: Over-Glass")
            OverGlassBackdrop {
                DialRow()
            }

            InteractiveHint()
            DemoNotes("State: Clicked —— 交互态，无法静态强制")
        }
    }
}
