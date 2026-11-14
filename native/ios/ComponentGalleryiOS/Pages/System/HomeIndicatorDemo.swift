import SwiftUI

/// Home Indicator：Device × Orientation，指示条宽度随设备与方向变化。
struct HomeIndicatorDemo: View {
    let family: ComponentSet

    var body: some View {
        ForEach(family.kids) { kid in
            DemoCase(title: "\(kid.values.joined(separator: " · "))") {
                SimHomeIndicator(width: width(for: kid.values))
                    .frame(maxWidth: .infinity, minHeight: 36)
                    .background(.fill.quaternary, in: .rect(cornerRadius: 10))
            }
        }
    }

    private func width(for values: [String]) -> Double {
        if values.contains("iPad") {
            200
        } else if values.contains("Landscape") {
            180
        } else {
            134
        }
    }
}
