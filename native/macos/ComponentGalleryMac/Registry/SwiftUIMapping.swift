import Foundation

/// 页面级的 SwiftUI 对应：级别（原生、桥接、部分、自绘、不做）和 API 说明（Markdown）。
struct SwiftUIMapping: Decodable, Sendable {
    let level: String
    let api: String

    /// 系统不提供真实控件、只能模拟外观的页面。
    var isSimulated: Bool { level == "自绘" }

    /// 把 API 说明里的 `code` 渲染成代码样式。
    var apiText: AttributedString {
        (try? AttributedString(markdown: api)) ?? AttributedString(api)
    }
}
