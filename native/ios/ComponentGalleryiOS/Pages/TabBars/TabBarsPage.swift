import SwiftUI

struct TabBarsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "3:70967":
                TabBarSample()
            case "12887:20935":
                TabBarSample()
                UnreproducedList(items: [
                    "iPhone Duo 外屏的竖排标签栏由系统按显示屏自动切换，请在 iPhone Duo 模拟器上查看",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "2524:7957":
                TabBarSample(isSidebarAdaptable: true)
                UnreproducedList(items: [
                    "iPad 顶部标签栏只在 iPad 宽度下出现；iPhone 上同一代码显示为底部标签栏",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
