import SwiftUI

struct MenusPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4353:2293":
                MenuPartDemo(hint: "菜单背景（Liquid Glass 材质）由系统绘制，打开菜单即可看到")
            case "4353:3147":
                MenuPartDemo(
                    hint: "Header 是 Section 的标题；有勾选项的菜单里标题向右缩进（Inset: True）",
                    notes: ["Inset —— 由系统根据菜单里是否有勾选项决定，App 不能单独指定"]
                )
            case "4353:3151":
                MenuPartDemo(hint: "分隔线来自菜单里的 Divider()")
            case "121:12600":
                MenuPartDemo(
                    hint: "Hover：把指针移到菜单项上；Hover + Key：带快捷键的项悬停时",
                    notes: ["State: Hover、Hover + Key —— 交互态，只能在打开的菜单里悬停查看"]
                )
            case "483:8811":
                FullMenuDemo()
            default:
                PlaceholderDemo()
            }
        }
    }
}
