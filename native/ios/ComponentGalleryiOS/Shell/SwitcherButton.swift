import SwiftUI

/// 右下角常驻的圆形玻璃按钮，⌘K 同样可用。
struct SwitcherButton: View {
    let action: () -> Void

    var body: some View {
        Button("切换页面", systemImage: "square.grid.2x2", action: action)
            .labelStyle(.iconOnly)
            .font(.title2)
            .frame(width: 56, height: 56)
            .contentShape(.circle)
            .glassEffect(.regular.interactive(), in: .circle)
            .buttonStyle(.plain)
            .keyboardShortcut("k", modifiers: .command)
    }
}
