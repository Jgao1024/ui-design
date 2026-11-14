import SwiftUI

/// 窗口内的悬浮切换面板：搜索、按分类列出全部页面、明暗开关。
/// ↑ ↓ 选择，Return 跳转，Esc 关闭。
struct SwitcherPanel: View {
    let index: PageIndex
    let currentSlug: String
    let onSelect: (Page) -> Void
    let onClose: () -> Void

    @AppStorage("appearance") private var appearance = AppearanceMode.system
    @State private var query = ""
    @State private var highlightedSlug: String?
    @FocusState private var isSearchFocused: Bool

    var body: some View {
        let sections = index.search(query)
        let pages = sections.flatMap(\.hits).map(\.page)

        ZStack {
            Color.black.opacity(0.15)
                .ignoresSafeArea()
                .onTapGesture(perform: onClose)
                .accessibilityLabel("关闭切换面板")
                .accessibilityAddTraits(.isButton)

            VStack(spacing: 0) {
                TextField("搜索页面或组件族", text: $query)
                    .textFieldStyle(.plain)
                    .font(.title3)
                    .padding(14)
                    .focused($isSearchFocused)
                    .onKeyPress(.upArrow) { moveHighlight(by: -1, in: pages) }
                    .onKeyPress(.downArrow) { moveHighlight(by: 1, in: pages) }
                    .onKeyPress(.escape) {
                        onClose()
                        return .handled
                    }
                    .onSubmit { confirm(in: pages) }

                Divider()

                SwitcherResults(
                    sections: sections,
                    currentSlug: currentSlug,
                    highlightedSlug: highlightedSlug,
                    onSelect: onSelect
                )

                Divider()

                Picker("外观", selection: $appearance) {
                    ForEach(AppearanceMode.allCases) { mode in
                        Text(mode.title).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding(12)
            }
            .frame(width: 520, height: 560)
            .glassEffect(.regular, in: .rect(cornerRadius: 22))
        }
        .onExitCommand(perform: onClose)
        .onAppear {
            highlightedSlug = currentSlug
            isSearchFocused = true
        }
        .onChange(of: query) {
            highlightedSlug = index.search(query).first?.hits.first?.page.slug
        }
    }

    private func moveHighlight(by offset: Int, in pages: [Page]) -> KeyPress.Result {
        guard !pages.isEmpty else { return .handled }
        let current = pages.firstIndex { $0.slug == highlightedSlug } ?? -offset
        let next = min(max(current + offset, 0), pages.count - 1)
        highlightedSlug = pages[next].slug
        return .handled
    }

    private func confirm(in pages: [Page]) {
        guard let page = pages.first(where: { $0.slug == highlightedSlug }) ?? pages.first else { return }
        onSelect(page)
    }
}
