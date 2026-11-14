import SwiftUI

/// 工具栏 Button Group 族：`ControlGroup`。
struct ToolbarButtonGroupDemo: View {
    var body: some View {
        ToolbarFamilyDemo {
            ControlGroup {
                Button("后退", systemImage: "chevron.left") {}
                Button("前进", systemImage: "chevron.right") {}
            }
            .fixedSize()
        }
    }
}
