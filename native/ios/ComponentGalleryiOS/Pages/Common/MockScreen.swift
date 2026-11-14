import SwiftUI

/// 整屏类模拟画面：按设计稿宽高比缩放到适应宽度（fit-to-width），不出现横向滚动。
struct MockScreen<Content: View>: View {
    let width: Double
    let height: Double
    var maxWidth: Double = 360
    var cornerRadius: Double = 28
    @ContentBuilder let content: Content

    var body: some View {
        content
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .aspectRatio(width / max(height, 1), contentMode: .fit)
            .clipShape(.rect(cornerRadius: cornerRadius))
            .frame(maxWidth: maxWidth)
    }
}
