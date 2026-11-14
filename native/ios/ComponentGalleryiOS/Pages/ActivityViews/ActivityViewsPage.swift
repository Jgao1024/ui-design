import SwiftUI

struct ActivityViewsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { solo in
            switch solo.id {
            case "5846:3358":
                ShareSheetDemo(note: "点击后系统在分享面板背后绘制暗色遮罩（Overlay）")
            case "128:60578":
                ShareSheetDemo(note: "在 iPad 上点击，分享面板以 popover 形式出现")
            case "128:58645":
                ShareSheetDemo(note: "在 iPhone 上点击，分享面板以 sheet 形式出现")
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
