import SwiftUI

struct ColorPickersPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5739:34128": PickerButtonDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "515:56319": ColorPickerPanelDemo(note: "在 iPad 上点击色块，颜色面板以 popover 形式出现")
            case "0:5275": ColorPickerPanelDemo(note: "在 iPhone 上点击色块，颜色面板以 sheet 形式出现")
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
