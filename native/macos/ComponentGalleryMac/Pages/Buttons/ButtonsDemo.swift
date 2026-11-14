import SwiftUI

/// Buttons 族：Context × Active × Style × State。
struct ButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            AxisLabel("Context: Content Area")
            ActiveComparison {
                ButtonsGrid()
            }

            AxisLabel("Context: Over-Glass")
            ActiveComparison {
                OverGlassBackdrop {
                    ButtonsGrid()
                }
            }

            InteractiveHint()
            DemoNotes("State: Clicked —— 无法静态强制，请在「Clicked（按住）」列手动按住")
        }
    }
}
