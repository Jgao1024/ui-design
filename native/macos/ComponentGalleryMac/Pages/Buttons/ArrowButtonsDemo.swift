import SwiftUI

/// Arrow Buttons 族：圆形带箭头的图标按钮。
struct ArrowButtonsDemo: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Idle") {
                    ArrowButton()
                }
                VariantCell("Disabled") {
                    ArrowButton()
                        .disabled(true)
                }
                VariantCell("Clicked（按住）") {
                    ArrowButton()
                }
            }
            InteractiveHint()
            DemoNotes("State: Clicked —— 无法静态强制，请手动按住")
        }
    }
}
