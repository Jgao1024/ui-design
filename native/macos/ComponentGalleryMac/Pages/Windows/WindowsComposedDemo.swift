import SwiftUI

/// Windows - Composed 族：12 种 Window Type，每种打开一个真实窗口。
struct WindowsComposedDemo: View {
    private let columns = [GridItem(.adaptive(minimum: 280), spacing: 12, alignment: .leading)]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            LazyVGrid(columns: columns, alignment: .leading, spacing: 10) {
                ForEach(WindowDemoConfig.figmaTypes) { config in
                    OpenDemoWindowButton(config: config)
                }
            }
            Text("Active: True 是前台窗口，Active: False 是后台窗口：打开两个示例窗口来回切换即可对比。")
                .font(.callout)
                .foregroundStyle(.secondary)
            DemoNotes("Default 系列 —— .windowToolbarStyle(.automatic) 在有 NavigationSplitView 时由系统选择样式，可能与 Unified 看起来相同")
        }
    }
}
