import SwiftUI

struct TokenSectionTitle: View {
    let title: LocalizedStringResource
    let count: Int

    var body: some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.title2)
                .bold()
            Text("\(count) 个")
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .monospacedDigit()
        }
    }
}
