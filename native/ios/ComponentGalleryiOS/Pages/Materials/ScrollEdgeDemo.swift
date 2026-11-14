import SwiftUI

/// Scroll Edge Effect：在真实工具栏下滚动内容，顶部和底部边缘用指定样式过渡。
struct ScrollEdgeDemo: View {
    let style: ScrollEdgeEffectStyle

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(spacing: 12) {
                    ForEach(1...30, id: \.self) { row in
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(hue: Double(row) / 30, saturation: 0.6, brightness: 0.9))
                            .frame(height: 44)
                            .overlay {
                                Text("第 \(row) 行")
                            }
                    }
                }
                .padding()
            }
            .scrollEdgeEffectStyle(style, for: [.top, .bottom])
            .navigationTitle("滚动边缘")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Button("添加", systemImage: "plus") {}
                }
                ToolbarItem(placement: .bottomBar) {
                    Button("分享", systemImage: "square.and.arrow.up") {}
                }
            }
        }
        .frame(height: 340)
        .clipShape(.rect(cornerRadius: 16))
        InteractiveHint(text: "Edge: Top / Bottom：滚动列表，看顶部和底部工具栏下方的边缘过渡")
    }
}
