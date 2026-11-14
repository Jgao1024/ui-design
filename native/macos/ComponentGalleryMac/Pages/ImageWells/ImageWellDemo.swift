import SwiftUI

/// Image Well 族：`NSImageView` 桥接，Enabled True / False。
struct ImageWellDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Enabled: True") {
                    ImageWellView()
                        .frame(width: 64, height: 64)
                }
                VariantCell("Enabled: False") {
                    ImageWellView()
                        .frame(width: 64, height: 64)
                        .disabled(true)
                }
            }
            InteractiveHint(text: "可以把 Finder 里的图片拖进左边的图片框")
        }
    }
}
