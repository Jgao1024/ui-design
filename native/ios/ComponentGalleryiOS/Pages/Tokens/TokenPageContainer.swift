import SwiftUI

/// 令牌页骨架：页头 + 内容，懒加载长列表。
struct TokenPageContainer<Content: View>: View {
    let page: RegistryPage
    @ContentBuilder let content: Content

    var body: some View {
        ScrollView {
            LazyVStack(alignment: .leading, spacing: 24) {
                PageHeader(page: page)
                content
            }
            .padding()
            .padding(.bottom, 64)
        }
        .navigationTitle(page.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}
