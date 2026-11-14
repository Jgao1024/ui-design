import SwiftUI

struct GlassTile: View {
    let title: String
    let glass: Glass

    var body: some View {
        Text(verbatim: title)
            .font(.caption.monospaced())
            .multilineTextAlignment(.center)
            .padding(8)
            .frame(maxWidth: .infinity, minHeight: 72)
            .glassEffect(glass, in: .rect(cornerRadius: 14))
    }
}
