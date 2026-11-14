import SwiftUI

/// 工具栏 Pull Down Button 族：`Menu` + `.buttonStyle(.glass)`。
struct ToolbarPullDownDemo: View {
    var body: some View {
        ToolbarFamilyDemo {
            HStack(spacing: 24) {
                VariantCell("Idle") {
                    ToolbarActionsMenu()
                }
                VariantCell("Disabled") {
                    ToolbarActionsMenu()
                        .disabled(true)
                }
            }
        }
    }
}
