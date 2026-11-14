import SwiftUI

/// Buttons - Toggle 族：`Toggle` + `.toggleStyle(.button)`。
struct ToggleButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            AxisLabel("Context: Content Area")
            ActiveComparison {
                ToggleButtonsGrid()
            }

            AxisLabel("Context: Over-Glass")
            ActiveComparison {
                OverGlassBackdrop {
                    ToggleButtonsGrid()
                }
            }

            InteractiveHint()
            DemoNotes("State: Clicked —— 无法静态强制，请手动按住")
        }
    }
}
