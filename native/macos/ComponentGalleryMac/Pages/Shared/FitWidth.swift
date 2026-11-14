import SwiftUI

/// 整屏类视图按设计尺寸排版，再整体缩放到可用宽度（fit-to-width），不出现横向滚动。
struct FitWidth<Content: View>: View {
    let designSize: CGSize
    @ContentBuilder let content: Content

    var body: some View {
        Color.clear
            .aspectRatio(designSize.width / designSize.height, contentMode: .fit)
            .frame(maxWidth: .infinity)
            .overlay(alignment: .topLeading) {
                GeometryReader { proxy in
                    content
                        .frame(width: designSize.width, height: designSize.height)
                        .scaleEffect(proxy.size.width / designSize.width, anchor: .topLeading)
                }
            }
            .clipShape(.rect(cornerRadius: 10))
    }
}
