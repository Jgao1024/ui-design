import SwiftUI

/// 网格的行标题或列标题。
struct AxisLabel: View {
    let text: String

    init(_ text: String) {
        self.text = text
    }

    var body: some View {
        Text(text)
            .font(.caption)
            .bold()
            .foregroundStyle(.secondary)
    }
}
