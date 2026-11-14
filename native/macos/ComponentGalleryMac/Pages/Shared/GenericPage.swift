import SwiftUI

/// 没有专属页面视图时的兜底：所有族都显示占位卡，保证目录完整。
struct GenericPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderDemo()
        }
    }
}
