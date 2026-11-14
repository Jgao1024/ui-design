import SwiftUI

/// Figma kit 页面的统一骨架：页首 → 每个公开族一个区块 → 独立组件 → 内部件折叠区。
/// `demo` 按 nodeId 返回该组件的演示视图；没有演示的返回 `PlaceholderDemo`，保证目录完整。
struct PageScaffold<Demo: View>: View {
    let page: Page
    @ContentBuilder let demo: (Component) -> Demo

    var body: some View {
        VStack(alignment: .leading, spacing: 20) {
            PageHeader(page: page)

            ForEach(page.families) { family in
                ComponentSection(component: family) {
                    demo(family)
                }
            }

            if !page.solos.isEmpty {
                Text("独立组件")
                    .font(.title3)
                    .bold()
                    .padding(.top, 8)

                ForEach(page.solos) { solo in
                    ComponentSection(component: solo) {
                        demo(solo)
                    }
                }
            }

            if !page.internals.isEmpty {
                InternalsSection(parts: page.internals)
            }
        }
    }
}
