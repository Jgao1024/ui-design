import SwiftUI

/// Keyboards（部分）：键盘本体由系统绘制，用 TextField + keyboardType 触发真实键盘，配件栏用键盘工具栏。
struct KeyboardsPage: View {
    let page: RegistryPage

    @FocusState private var focus: KeyboardField?

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "12892:51480":
                KeyboardFieldList(fields: [.search], focus: $focus)
            case "5522:14771":
                KeyboardFieldList(fields: [.toolbarButton, .toolbarButtonGroup], focus: $focus)
            case "5720:47982":
                KeyboardFieldList(fields: [.find], focus: $focus)
            case "6334:12943":
                KeyboardFieldList(fields: [.url], focus: $focus)
            case "6334:13068":
                KeyboardFieldList(fields: [.webFormName, .webFormEmail], focus: $focus)
            case "5720:48008":
                KeyboardFieldList(fields: [.findReplaceFind, .findReplaceReplace], focus: $focus)
            case "106:60296":
                KeyboardFieldList(fields: [.letters, .numbers, .email, .urlType, .web, .numberPad, .emoji], focus: $focus)
                UnreproducedList(items: [
                    "Upper Case / Lower Case / Punctuation：键盘内部状态，需手动点 ⇧ 或 123、#+=",
                    "Emoji：没有 keyboardType 能直接打开表情键盘，需手动点表情键",
                ])
            case "12890:26716":
                KeyboardFieldList(fields: [.duoLetters, .duoNumbers], focus: $focus)
                UnreproducedList(items: [
                    "Display: Inner / Outer、Orientation：由设备决定，请在 iPhone Duo 模拟器上折叠、展开、旋转查看",
                    "Upper Case / Punctuation：键盘内部状态，需手动切换",
                ])
            case "128:78692":
                KeyboardFieldList(fields: [.iPadLetters], focus: $focus)
                UnreproducedList(items: [
                    "iPad 键盘：请在 iPad 模拟器上查看；Shift 为键盘内部状态，需手动点 ⇧",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
        .toolbar {
            ToolbarItemGroup(placement: .keyboard) {
                KeyboardAccessoryItems(focus: $focus)
            }
        }
    }
}
