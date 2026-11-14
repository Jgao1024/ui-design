import SwiftUI

/// Segmented Control 族：Selectable True 用 `Picker(.segmented)`，False（瞬时按钮组）用 `ControlGroup`。
struct SegmentedControlDemo: View {
    @State private var alignment = 0

    var body: some View {
        ActiveComparison {
            HStack(alignment: .top, spacing: 40) {
                VariantCell("Selectable: True") {
                    Picker("对齐", selection: $alignment) {
                        Text("左对齐").tag(0)
                        Text("居中").tag(1)
                        Text("右对齐").tag(2)
                    }
                    .pickerStyle(.segmented)
                    .labelsHidden()
                    .fixedSize()
                }
                VariantCell("Selectable: False") {
                    ControlGroup {
                        Button("放大", systemImage: "plus.magnifyingglass") {}
                        Button("缩小", systemImage: "minus.magnifyingglass") {}
                        Button("实际大小", systemImage: "1.magnifyingglass") {}
                    }
                    .fixedSize()
                }
            }
        }
    }
}
