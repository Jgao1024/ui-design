import SwiftUI

/// `.bordered` + `.buttonBorderShape(.circle)` 的箭头按钮。
struct ArrowButton: View {
    var body: some View {
        Button("前往", systemImage: "chevron.forward") {}
            .labelStyle(.iconOnly)
            .buttonStyle(.bordered)
            .buttonBorderShape(.circle)
    }
}
