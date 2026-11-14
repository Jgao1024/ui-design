import SwiftUI

/// Sidebars - Composed 族：完整侧边栏，三种 Size；完整窗口里的侧边栏见示例窗口。
struct SidebarsComposedDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .top, spacing: 16) {
                ForEach(SidebarSizes.all, id: \.name) { entry in
                    VariantCell("Size: \(entry.name)") {
                        SidebarSectionsList(size: entry.size, height: 420)
                    }
                }
            }
            OpenDemoWindowButton(config: WindowDemoConfig(style: .unified))
        }
    }
}
