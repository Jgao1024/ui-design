import SwiftUI

struct WindowsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "683:16442":
                WindowBackgroundDemo()
            case "488:17656":
                WindowPartDemo(
                    explanation: "标准窗口的红绿灯就在本窗口左上角；切到别的 App 即为 Active: False。",
                    configs: [WindowDemoConfig(style: .unified)]
                )
            case "488:17661":
                WindowPartDemo(
                    explanation: "实用工具面板（UtilityWindow）的红绿灯更小；点别的窗口后即为 Active: False。",
                    configs: [],
                    showsUtilityPanel: true
                )
            case "4358:16748":
                WindowPartDemo(
                    explanation: "With Sidebar: True 时标题跟在侧边栏右侧；False 时标题从窗口左侧开始。",
                    configs: [WindowDemoConfig(style: .unified), WindowDemoConfig(style: .unified, showsSidebar: false)]
                )
            case "4363:18459":
                WindowsComposedDemo()
            case "4374:54811", "650:5930":
                WindowPartDemo(
                    explanation: "UtilityWindow 是浮动的实用工具面板，标题栏更矮、标题字号更小。",
                    configs: [],
                    showsUtilityPanel: true
                )
            default:
                PlaceholderDemo()
            }
        }
    }
}
