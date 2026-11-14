import SwiftUI

/// 工具栏 Segmented Control 族：`Picker(.segmented)`。
struct ToolbarSegmentedDemo: View {
    @State private var viewMode = 0

    var body: some View {
        ToolbarFamilyDemo {
            Picker("显示方式", selection: $viewMode) {
                Label("图标", systemImage: "square.grid.2x2").tag(0)
                Label("列表", systemImage: "list.bullet").tag(1)
                Label("分栏", systemImage: "rectangle.split.3x1").tag(2)
            }
            .pickerStyle(.segmented)
            .labelStyle(.iconOnly)
            .labelsHidden()
            .fixedSize()
        }
    }
}
