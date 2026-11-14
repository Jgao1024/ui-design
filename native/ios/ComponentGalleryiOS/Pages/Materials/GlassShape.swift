import SwiftUI

/// 彩色底图上的一块 Liquid Glass。
struct GlassShape: View {
    let title: LocalizedStringResource
    let glass: Glass
    let cornerRadius: Double
    let height: Double

    var body: some View {
        Text(title)
            .font(.subheadline)
            .frame(maxWidth: .infinity, minHeight: height)
            .glassEffect(glass, in: .rect(cornerRadius: cornerRadius))
    }
}
