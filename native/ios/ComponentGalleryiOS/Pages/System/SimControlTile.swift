import SwiftUI

/// 控制中心里的一个玻璃控制块：一个或一组图标，可选标题。
struct SimControlTile: View {
    let symbols: [String]
    var title: LocalizedStringResource?

    var body: some View {
        VStack(spacing: 8) {
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: min(symbols.count, 2)), spacing: 8) {
                ForEach(symbols, id: \.self) { symbol in
                    Image(systemName: symbol)
                        .font(.title3)
                        .frame(width: 40, height: 40)
                        .glassEffect(.regular, in: .circle)
                }
            }
            if let title {
                Text(title)
                    .font(.caption)
            }
        }
        .padding(10)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .glassEffect(.regular, in: .rect(cornerRadius: 22))
        .accessibilityElement(children: .combine)
    }
}
