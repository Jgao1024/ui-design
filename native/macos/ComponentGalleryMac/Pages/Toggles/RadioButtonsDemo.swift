import SwiftUI

/// Toggles - Radio Buttons 族：`Picker(.radioGroup)`。
struct RadioButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ActiveComparison {
                RadioButtonsGrid()
            }
            InteractiveHint()
            DemoNotes(
                "Selection: Mixed —— SwiftUI 的单选组没有混合态，无法复现（6 个变体）",
                "State: Clicked —— 交互态，无法静态强制"
            )
        }
    }
}
