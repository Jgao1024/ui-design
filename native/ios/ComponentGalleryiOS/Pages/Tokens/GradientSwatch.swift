import SwiftUI

struct GradientSwatch: View {
    let token: GradientToken

    private var gradient: Gradient {
        Gradient(stops: token.stops.map {
            Gradient.Stop(color: Color(hex: $0.hex, alpha: $0.alpha), location: $0.position)
        })
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            RoundedRectangle(cornerRadius: 10)
                .fill(LinearGradient(gradient: gradient, startPoint: .leading, endPoint: .trailing))
                .stroke(.separator, lineWidth: 1)
                .frame(height: 44)
            Text(token.stops.map { "\($0.hex) α\($0.alpha.formatted()) @\($0.position.formatted())" }.formatted(.list(type: .and, width: .narrow)))
                .font(.caption.monospaced())
            Text("\(token.uses) 次")
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
    }
}
