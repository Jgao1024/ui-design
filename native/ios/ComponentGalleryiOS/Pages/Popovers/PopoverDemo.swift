import SwiftUI

/// Popovers (iPad Only)：选 Edge 后点击按钮弹出真实 popover。iPhone 上也强制保持 popover 形态。
struct PopoverDemo: View {
    @State private var edge = PopoverEdge.topCenter
    @State private var isPresented = false

    var body: some View {
        Picker("Edge", selection: $edge) {
            ForEach(PopoverEdge.allCases) { Text($0.rawValue).tag($0) }
        }
        .pickerStyle(.menu)

        Button("显示 Popover", systemImage: "bubble.left", action: present)
            .buttonStyle(.borderedProminent)
            .popover(isPresented: $isPresented, arrowEdge: edge.arrowEdge) {
                Text("Popover 内容")
                    .padding()
                    .frame(minWidth: 200, minHeight: 120)
                    .presentationCompactAdaptation(.popover)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: edge.anchorAlignment)
            .padding()
            .frame(height: 260)
            .background(.fill.quaternary, in: .rect(cornerRadius: 16))

        UnreproducedList(items: [
            "箭头方向是请求值；空间不够时系统会换到其他边",
        ])
    }

    private func present() {
        isPresented = true
    }
}
