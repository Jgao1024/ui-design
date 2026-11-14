import SwiftUI

struct ContextualMenusPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "125:58750":
                DemoCase(title: "Alignment: Vertical") {
                    ContextMenuDemo(showsHorizontalGroup: false)
                }
                DemoCase(title: "Alignment: Horizontal (iPad only)") {
                    ContextMenuDemo(showsHorizontalGroup: true)
                }
                InteractiveHint(text: "长按卡片弹出菜单")
                UnreproducedList(items: [
                    "Side: Leading / Trailing：菜单出现在哪一侧由系统按卡片在屏幕上的位置决定",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "128:76929":
                ContextMenuDemo(showsHorizontalGroup: false)
                InteractiveHint(text: "长按卡片，菜单背后的模糊暗色遮罩由系统绘制")
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
