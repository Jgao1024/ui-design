import SwiftUI

/// 尚未实现的族的占位卡。区块标题已列出族名、nodeId、属性轴和变体数。
struct PlaceholderDemo: View {
    var body: some View {
        Label("尚未实现，SwiftUI 对应见页首", systemImage: "hammer")
            .foregroundStyle(.secondary)
            .frame(maxWidth: .infinity, minHeight: 60)
            .overlay {
                RoundedRectangle(cornerRadius: 8)
                    .strokeBorder(.secondary, style: StrokeStyle(lineWidth: 1, dash: [4]))
            }
    }
}
