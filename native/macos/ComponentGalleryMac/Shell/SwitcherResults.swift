import SwiftUI

/// 切换面板的结果列表，按 8 个分类分组；高亮行变化时自动滚到可见位置。
struct SwitcherResults: View {
    let sections: [SearchSection]
    let currentSlug: String
    let highlightedSlug: String?
    let onSelect: (Page) -> Void

    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 2, pinnedViews: .sectionHeaders) {
                    ForEach(sections) { section in
                        Section {
                            ForEach(section.hits) { hit in
                                SwitcherRow(
                                    hit: hit,
                                    isCurrent: hit.page.slug == currentSlug,
                                    isHighlighted: hit.page.slug == highlightedSlug,
                                    onSelect: onSelect
                                )
                                .id(hit.page.slug)
                            }
                        } header: {
                            Text("\(section.category.id) \(section.category.label)")
                                .font(.caption)
                                .bold()
                                .foregroundStyle(.secondary)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 6)
                                .background(.bar)
                        }
                    }
                }
                .padding(.horizontal, 8)
                .padding(.bottom, 8)
            }
            .overlay {
                if sections.isEmpty {
                    ContentUnavailableView.search
                }
            }
            .onChange(of: highlightedSlug) {
                guard let highlightedSlug else { return }
                proxy.scrollTo(highlightedSlug, anchor: .center)
            }
            .onAppear {
                proxy.scrollTo(currentSlug, anchor: .center)
            }
        }
    }
}
