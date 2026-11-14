import SwiftUI

struct SizeSwatch: View {
    let item: CountedValue

    /// key 形如 "402x874"。
    private var size: (width: Double, height: Double) {
        let parts = item.key.split(separator: "x").compactMap { Double($0) }
        return parts.count == 2 ? (parts[0], parts[1]) : (1, 1)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: 4)
                .fill(.tint.quaternary)
                .stroke(.tint, lineWidth: 1)
                .aspectRatio(size.width / max(size.height, 1), contentMode: .fit)
                .frame(maxWidth: .infinity, maxHeight: 64)
            Text(item.key)
                .font(.caption.monospaced())
            Text("\(item.count) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}
