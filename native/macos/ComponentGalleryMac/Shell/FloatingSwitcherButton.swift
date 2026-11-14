import SwiftUI

/// 右下角常驻的圆形浮窗按钮，点击或按 ⌘K 打开切换面板。
struct FloatingSwitcherButton: View {
    let action: () -> Void

    var body: some View {
        Button("切换页面（⌘K）", systemImage: "square.grid.2x2", action: action)
            .labelStyle(.iconOnly)
            .font(.title2)
            .frame(width: 52, height: 52)
            .contentShape(.circle)
            .buttonStyle(.plain)
            .glassEffect(.regular.interactive(), in: .circle)
            .keyboardShortcut("k", modifiers: .command)
            .help("切换页面（⌘K）")
    }
}
