import SwiftUI

/// Picker Button：Size × Selected。
struct PickerButtonDemo: View {
    @State private var large = Color.blue
    @State private var small = Color.orange

    var body: some View {
        HStack(spacing: 32) {
            DemoCase(title: "Large") {
                ColorPicker("大号颜色按钮", selection: $large)
                    .labelsHidden()
                    .controlSize(.large)
            }
            DemoCase(title: "Small") {
                ColorPicker("小号颜色按钮", selection: $small)
                    .labelsHidden()
                    .controlSize(.small)
            }
        }
        UnreproducedList(items: [
            "Selected: True：选中高亮环只在系统颜色面板打开时出现，无法静态强制",
            "Size：iOS 的 ColorPicker 色块不随 controlSize 改变尺寸，两种尺寸外观可能相同",
        ])
    }
}
