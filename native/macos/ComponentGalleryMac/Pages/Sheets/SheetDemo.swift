import SwiftUI

/// Sheet 族：真实的 `.sheet(isPresented:)`，从窗口标题栏下方滑出。
struct SheetDemo: View {
    @State private var isPresented = false

    var body: some View {
        Button("显示 Sheet", systemImage: "rectangle.bottomhalf.inset.filled", action: present)
            .sheet(isPresented: $isPresented) {
                SheetContent()
            }
    }

    private func present() {
        isPresented = true
    }
}
