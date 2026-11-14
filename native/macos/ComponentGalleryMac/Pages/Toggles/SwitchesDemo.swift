import SwiftUI

/// Toggles - Switches 族：`Toggle` + `.toggleStyle(.switch)`。
struct SwitchesDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ActiveComparison {
                SwitchesGrid()
            }
            InteractiveHint()
            DemoNotes("State: Clicked —— 交互态，无法静态强制（Figma 轴值拼写为 Disabeld，按 Disabled 处理）")
        }
    }
}
