import SwiftUI

struct MaterialTile: View {
    let title: String
    let material: Material

    var body: some View {
        Text(verbatim: title)
            .font(.caption.monospaced())
            .multilineTextAlignment(.center)
            .padding(8)
            .frame(maxWidth: .infinity, minHeight: 72)
            .background(material, in: .rect(cornerRadius: 14))
    }
}
