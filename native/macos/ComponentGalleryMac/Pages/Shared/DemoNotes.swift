import SwiftUI

/// 区块底部的灰色小字：没有复现的变体，写明「轴值 + 原因」。
struct DemoNotes: View {
    let notes: [LocalizedStringResource]

    init(_ notes: LocalizedStringResource...) {
        self.notes = notes
    }

    init(notes: [LocalizedStringResource]) {
        self.notes = notes
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("未复现的变体")
                .bold()
            ForEach(notes.indices, id: \.self) { index in
                Text("· \(notes[index])")
            }
        }
        .font(.caption)
        .foregroundStyle(.secondary)
    }
}
