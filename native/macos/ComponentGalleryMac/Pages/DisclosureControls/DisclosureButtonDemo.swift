import SwiftUI

/// Disclosure Button 族：`DisclosureGroup`，Disclosed（行）× State（列）。
struct DisclosureButtonDemo: View {
    @State private var expanded = true
    @State private var collapsed = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Grid(alignment: .topLeading, horizontalSpacing: 32, verticalSpacing: 12) {
                GridRow {
                    AxisLabel("Disclosed")
                    AxisLabel("Idle")
                    AxisLabel("Disabled")
                }
                GridRow {
                    AxisLabel("True")
                    DisclosureGroup("详细信息", isExpanded: $expanded) {
                        Text("展开后的内容")
                    }
                    DisclosureGroup("详细信息", isExpanded: .constant(true)) {
                        Text("展开后的内容")
                    }
                    .disabled(true)
                }
                GridRow {
                    AxisLabel("False")
                    DisclosureGroup("详细信息", isExpanded: $collapsed) {
                        Text("展开后的内容")
                    }
                    DisclosureGroup("详细信息", isExpanded: .constant(false)) {
                        Text("展开后的内容")
                    }
                    .disabled(true)
                }
            }
            InteractiveHint(text: "Clicked：在 Idle 列按住箭头")
            DemoNotes(
                "State: Clicked —— 交互态，无法静态强制",
                "Figma 画的是带圆角底座的上下箭头按钮（NSButton 的 disclosure 样式）；SwiftUI 的 DisclosureGroup 在 macOS 上画的是三角箭头，没有公开 API 切换成该按钮外观"
            )
        }
    }
}
