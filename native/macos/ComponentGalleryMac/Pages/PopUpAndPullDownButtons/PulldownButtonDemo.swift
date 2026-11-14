import SwiftUI

/// Pulldown Button 族：`Menu`（下拉按钮，标题固定，菜单项执行操作）。
struct PulldownButtonDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Idle") {
                    ActionsMenu()
                }
                VariantCell("Disabled") {
                    ActionsMenu()
                        .disabled(true)
                }
                VariantCell("Clicked（点击展开）") {
                    ActionsMenu()
                }
            }
            InteractiveHint()
            DemoNotes("State: Clicked —— 交互态，点击按钮即展开真实菜单")
        }
    }
}
