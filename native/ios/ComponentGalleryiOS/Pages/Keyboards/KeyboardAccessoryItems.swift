import SwiftUI

/// 键盘配件栏（ToolbarItemGroup(placement: .keyboard)）的内容，按当前焦点切换。
/// 整页只挂一个键盘工具栏，避免多个输入框各挂一个时按钮重复。
struct KeyboardAccessoryItems: View {
    var focus: FocusState<KeyboardField?>.Binding

    var body: some View {
        switch focus.wrappedValue {
        case .search?:
            Button("最近搜索", systemImage: "clock") {}
            Spacer()
            Button("完成", action: dismissKeyboard)
        case .toolbarButton?:
            Spacer()
            Button("完成", action: dismissKeyboard)
        case .toolbarButtonGroup?:
            Button("粗体", systemImage: "bold") {}
            Button("斜体", systemImage: "italic") {}
            Button("下划线", systemImage: "underline") {}
            Spacer()
            Button("完成", action: dismissKeyboard)
        case .find?:
            Button("上一个", systemImage: "chevron.up") {}
            Button("下一个", systemImage: "chevron.down") {}
            Spacer()
            Text("1/3")
                .monospacedDigit()
            Button("完成", action: dismissKeyboard)
        case .url?:
            Button(".com") {}
            Button("/") {}
            Spacer()
            Button("完成", action: dismissKeyboard)
        case .webFormName?, .webFormEmail?:
            Button("上一个", systemImage: "chevron.up", action: previousField)
            Button("下一个", systemImage: "chevron.down", action: nextField)
            Spacer()
            Button("自动填充", systemImage: "key") {}
            Button("完成", action: dismissKeyboard)
        case .findReplaceFind?, .findReplaceReplace?:
            Button("上一个", systemImage: "chevron.up", action: previousField)
            Button("下一个", systemImage: "chevron.down", action: nextField)
            Spacer()
            Button("替换") {}
            Button("全部替换") {}
            Button("完成", action: dismissKeyboard)
        default:
            Spacer()
            Button("完成", action: dismissKeyboard)
        }
    }

    private func dismissKeyboard() {
        focus.wrappedValue = nil
    }

    private func previousField() {
        switch focus.wrappedValue {
        case .webFormEmail?: focus.wrappedValue = .webFormName
        case .findReplaceReplace?: focus.wrappedValue = .findReplaceFind
        default: break
        }
    }

    private func nextField() {
        switch focus.wrappedValue {
        case .webFormName?: focus.wrappedValue = .webFormEmail
        case .findReplaceFind?: focus.wrappedValue = .findReplaceReplace
        default: break
        }
    }
}
