import SwiftUI

/// Window BG 族：`ShapeStyle.windowBackground`。
struct WindowBackgroundDemo: View {
    var body: some View {
        ActiveComparison {
            RoundedRectangle(cornerRadius: 12)
                .fill(.windowBackground)
                .strokeBorder(.separator)
                .frame(width: 300, height: 160)
        }
    }
}
