import SwiftUI

/// 自绘：Dock 的模拟外观（Liquid Glass 底 + 真实 App 图标）。
struct DockMock: View {
    var body: some View {
        HStack(spacing: 6) {
            ForEach(DockApps.paths, id: \.self) { path in
                DockIcon(path: path, isRunning: path == DockApps.paths[0])
            }
        }
        .padding(.horizontal, 10)
        .padding(.top, 6)
        .padding(.bottom, 2)
        .glassEffect(.regular, in: .rect(cornerRadius: 22))
    }
}
