import SwiftUI

struct WindowsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "12492:2483":
                SplitViewSample()
                UnreproducedList(items: [
                    "Mode: Inactive：窗口是否激活由系统决定；在 iPad 上开两个窗口来回切换可见",
                    "窗口外框与窗口控制按钮由系统绘制",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "5588:3741":
                NewWindowButton()
                UnreproducedList(items: [
                    "窗口外框、窗口控制按钮与缩放手柄由系统绘制，App 只能通过 WindowGroup 打开真实窗口",
                ])
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
