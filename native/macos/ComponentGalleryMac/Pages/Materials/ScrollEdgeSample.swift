import SwiftUI

/// 带顶栏或底栏的小滚动视图，用 `.scrollEdgeEffectStyle` 指定栏下方内容的边缘效果。
struct ScrollEdgeSample: View {
    let style: ScrollEdgeEffectStyle
    let edge: VerticalEdge

    private let colors: [Color] = [.red, .orange, .yellow, .green, .teal, .blue, .indigo, .purple]

    var body: some View {
        ScrollView {
            VStack(spacing: 6) {
                ForEach(0..<24, id: \.self) { index in
                    Text("第 \(index + 1) 行")
                        .frame(maxWidth: .infinity, minHeight: 28)
                        .background(colors[index % colors.count].opacity(0.6), in: .rect(cornerRadius: 6))
                }
            }
            .padding(8)
        }
        .defaultScrollAnchor(.center)
        .safeAreaBar(edge: edge) {
            Text(edge == .top ? "顶部栏" : "底部栏")
                .bold()
                .frame(maxWidth: .infinity)
                .padding(8)
        }
        .scrollEdgeEffectStyle(style, for: edge == .top ? .top : .bottom)
        .frame(width: 200, height: 200)
        .background(.background)
        .clipShape(.rect(cornerRadius: 10))
    }
}
