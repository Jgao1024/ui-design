import SwiftUI

/// Toggles - Checkboxes 族：`Toggle` + `.toggleStyle(.checkbox)`。
struct CheckboxesDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ActiveComparison {
                CheckboxesGrid()
            }
            InteractiveHint()
            DemoNotes("State: Clicked —— 交互态，无法静态强制")
        }
    }
}
