import SwiftUI

/// 工具栏 Button 族：图标按钮 + `.buttonStyle(.glass)`，State Idle / Disabled。
struct ToolbarButtonDemo: View {
    var body: some View {
        ToolbarFamilyDemo {
            HStack(spacing: 24) {
                VariantCell("Idle") {
                    Button("新建", systemImage: "square.and.pencil") {}
                        .labelStyle(.iconOnly)
                        .buttonStyle(.glass)
                }
                VariantCell("Disabled") {
                    Button("删除", systemImage: "trash") {}
                        .labelStyle(.iconOnly)
                        .buttonStyle(.glass)
                        .disabled(true)
                }
            }
        }
    }
}
