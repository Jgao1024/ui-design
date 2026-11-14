import SwiftUI

/// 顶部工具栏画布：可选包在 TabView 里，演示 Tab Bar: True。
struct TopToolbarCanvas: View {
    let style: TopBarStyle
    let showsTabBar: Bool

    var body: some View {
        if showsTabBar {
            TabView {
                Tab("主页", systemImage: "house") {
                    TopToolbarStack(style: style)
                }
                Tab("资料库", systemImage: "books.vertical") {
                    TopToolbarStack(style: style)
                }
                Tab("设置", systemImage: "gear") {
                    TopToolbarStack(style: style)
                }
            }
            .tabViewStyle(.sidebarAdaptable)
        } else {
            TopToolbarStack(style: style)
        }
    }
}
