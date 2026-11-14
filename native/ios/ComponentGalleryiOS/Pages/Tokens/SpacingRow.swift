import SwiftUI

struct SpacingRow: View {
    let item: CountedValue

    private var spacing: Double {
        Double(item.key) ?? 0
    }

    var body: some View {
        HStack {
            Text("\(spacing, format: .number.precision(.fractionLength(0...2))) pt")
                .font(.caption.monospaced())
                .frame(width: 72, alignment: .leading)
            // 条长 = 间距值（最长 200pt），负间距画成灰色。
            Capsule()
                .fill(spacing < 0 ? AnyShapeStyle(.gray) : AnyShapeStyle(.tint))
                .frame(width: max(2, min(abs(spacing), 200)), height: 8)
            Spacer()
            Text("\(item.count) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
    }
}
