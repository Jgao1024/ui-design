import SwiftUI

/// Dock Icon 族（自绘）：单个 Dock 图标 + 运行指示点。
struct DockIconDemo: View {
    var body: some View {
        HStack(spacing: 32) {
            VariantCell("运行中") {
                DockIcon(path: DockApps.paths[0], isRunning: true)
            }
            VariantCell("未运行") {
                DockIcon(path: DockApps.paths[1])
            }
        }
    }
}
