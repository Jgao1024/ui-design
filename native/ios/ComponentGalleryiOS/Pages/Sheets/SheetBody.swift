import SwiftUI

/// Sheet 内容。Large (Stacked) 时可以在 sheet 上再叠一层 sheet。
struct SheetBody: View {
    let option: SheetDetentOption

    @Environment(\.dismiss) private var dismiss
    @State private var showsStacked = false

    var body: some View {
        NavigationStack {
            List {
                Text("Detent: \(option.rawValue)")
                if option == .largeStacked {
                    Button("再叠一层 Sheet", systemImage: "square.stack", action: presentStacked)
                }
            }
            .navigationTitle("Sheet")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("完成", systemImage: "checkmark", action: close)
                }
            }
        }
        .presentationDetents(option.detents)
        .presentationDragIndicator(.visible)
        .sheet(isPresented: $showsStacked) {
            SheetBody(option: .large)
        }
    }

    private func presentStacked() {
        showsStacked = true
    }

    private func close() {
        dismiss()
    }
}
