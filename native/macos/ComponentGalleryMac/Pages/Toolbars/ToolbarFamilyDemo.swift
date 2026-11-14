import SwiftUI

/// 工具栏各族共用的布局：真实工具栏在示例窗口里；页内按 Size × Active 展示同款系统控件。
struct ToolbarFamilyDemo<Content: View>: View {
    var notes: [LocalizedStringResource] = []
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                OpenDemoWindowButton(config: WindowDemoConfig(style: .unified))
                Text("示例窗口的工具栏里是真实外观。")
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }

            ActiveComparison {
                Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 12) {
                    ForEach(ToolbarControlSize.all, id: \.name) { entry in
                        GridRow {
                            AxisLabel("Size: \(entry.name)")
                            content
                                .controlSize(entry.size)
                        }
                    }
                }
            }

            DemoNotes(notes: notes + ["页内外观 —— 工具栏的玻璃底座和分组由窗口工具栏绘制；页内用同款控件（按钮加 .glass 样式）近似，真实外观看示例窗口"])
        }
    }
}
