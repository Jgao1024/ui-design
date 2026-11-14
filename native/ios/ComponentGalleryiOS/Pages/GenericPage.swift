import SwiftUI

/// 没有专属演示的页面：每个族和独立组件都显示占位卡。
struct GenericPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
