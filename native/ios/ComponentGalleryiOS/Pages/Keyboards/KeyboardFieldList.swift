import SwiftUI

/// 一组触发真实系统键盘的输入框。
struct KeyboardFieldList: View {
    let fields: [KeyboardField]
    var focus: FocusState<KeyboardField?>.Binding

    var body: some View {
        ForEach(fields, id: \.self) { field in
            KeyboardFieldRow(field: field, focus: focus)
        }
        InteractiveHint(text: "点击输入框弹出真实系统键盘；配件栏在键盘上方")
    }
}
