import SwiftUI

/// Utility Panel Tab Bar 独立组件：实用工具面板顶部的图标分段控件。
struct UtilityPanelTabBarDemo: View {
    @State private var tab = 0

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Picker("检查器", selection: $tab) {
                Label("文件", systemImage: "doc").tag(0)
                Label("历史", systemImage: "clock").tag(1)
                Label("帮助", systemImage: "questionmark.circle").tag(2)
            }
            .pickerStyle(.segmented)
            .labelStyle(.iconOnly)
            .labelsHidden()
            .frame(width: 220)

            OpenUtilityPanelButton()
            DemoNotes("标签栏外观 —— SwiftUI 没有专门的面板标签栏控件，用图标分段控件近似")
        }
    }
}
