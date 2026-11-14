import SwiftUI

struct ColorSwatch: View {
    let token: ColorToken

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: 10)
                .fill(Color(hex: token.hex, alpha: token.alpha))
                .stroke(.separator, lineWidth: 1)
                .frame(height: 56)
            Text(token.hex)
                .font(.caption.monospaced())
            Text("α \(token.alpha, format: .number) · \(token.uses) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
        .accessibilityElement(children: .combine)
    }
}
