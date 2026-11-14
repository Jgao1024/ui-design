import SwiftUI

/// 点击后弹出真实的 `.popover`，按指定的边和锚点定位。
struct PopoverButton: View {
    let placement: PopoverPlacement

    @State private var isPresented = false

    var body: some View {
        Button(placement.name, action: toggle)
            .frame(minWidth: 150)
            .popover(isPresented: $isPresented, attachmentAnchor: .point(placement.anchor), arrowEdge: placement.edge) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(placement.name)
                        .bold()
                    Text("arrowEdge: .\(String(describing: placement.edge))")
                        .font(.callout.monospaced())
                        .foregroundStyle(.secondary)
                }
                .padding()
            }
    }

    private func toggle() {
        isPresented.toggle()
    }
}
