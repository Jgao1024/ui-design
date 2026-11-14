import SwiftUI

struct CornerRadiusSwatch: View {
    let item: CountedValue

    private var radius: Double {
        Double(item.key) ?? 0
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            // 预览框高 64，圆角超过一半时已等同胶囊，按上限 32 绘制。
            RoundedRectangle(cornerRadius: min(radius, 32))
                .fill(.tint.quaternary)
                .stroke(.tint, lineWidth: 1)
                .frame(height: 64)
            Text("r \(radius, format: .number.precision(.fractionLength(0...2)))")
                .font(.caption.monospaced())
            Text("\(item.count) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}
