import SwiftUI

struct ToolbarsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5561:41165":
                TopToolbarDemo(styles: [.standard, .largeTitle, .compactLarge, .twoLine, .twoLineLeft], extra: .tabBar)
                UnreproducedList(items: [
                    "Tab Bar: True 的顶部标签栏只在 iPad 宽度下出现在工具栏里；iPhone 上显示为底部标签栏",
                ])
            case "12883:6008":
                TopToolbarDemo(styles: [.standard, .largeTitle, .compactLarge, .twoLine], extra: .sheet)
                UnreproducedList(items: [
                    "iPhone Duo 外屏的竖排工具栏由系统按显示屏自动切换，请在 iPhone Duo 模拟器上查看",
                ])
            case "1:54472":
                TopToolbarDemo(styles: TopBarStyle.allCases)
            case "4:55732":
                BottomToolbarDemo()
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "8515:13163":
                BottomToolbarDemo(types: [.buttons])
                UnreproducedList(items: [
                    "iPad 底部工具栏的宽度与按钮间距只在 iPad 上体现",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
