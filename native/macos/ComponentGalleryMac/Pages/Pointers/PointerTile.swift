import SwiftUI

/// 悬停区域：指针移进来就换成对应的系统指针。
struct PointerTile: View {
    let sample: PointerSample

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(sample.name)
                .bold()
            Text(sample.code)
                .font(.caption.monospaced())
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, minHeight: 64, alignment: .topLeading)
        .padding(10)
        .background(sample.style == nil ? AnyShapeStyle(.clear) : AnyShapeStyle(.fill.tertiary), in: .rect(cornerRadius: 8))
        .overlay {
            RoundedRectangle(cornerRadius: 8)
                .strokeBorder(.separator)
        }
        .pointerStyle(sample.style)
    }
}
