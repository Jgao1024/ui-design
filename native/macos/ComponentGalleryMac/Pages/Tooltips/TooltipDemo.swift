import SwiftUI

/// Tooltip 独立组件：`.help(_:)`，悬停约 1 秒后由系统显示。
struct TooltipDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Button("把指针停在这里") {}
                .help("这是一条工具提示")
            InteractiveHint(text: "悬停约 1 秒后出现")
        }
    }
}
