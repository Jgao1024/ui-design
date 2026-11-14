import SwiftUI

/// Text Selection / Edit Menu：在可编辑文字上选中，出现系统选择手柄与编辑菜单。
struct TextSelectionDemo: View {
    let hint: LocalizedStringResource

    @State private var text = "Liquid Glass 是一种动态材质，它会折射和反射周围的内容。双击或长按这段文字试试。"

    var body: some View {
        TextField("文字", text: $text, axis: .vertical)
            .lineLimit(3...)
            .textFieldStyle(.roundedBorder)
        InteractiveHint(text: hint)
    }
}
