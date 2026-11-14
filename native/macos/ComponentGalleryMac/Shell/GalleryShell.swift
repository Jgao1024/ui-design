import SwiftUI

/// 当前页面 + 右下角浮窗按钮 + 切换面板；负责 ← → 翻页和记住上次浏览的页面。
struct GalleryShell: View {
    let index: PageIndex

    @AppStorage("lastPageSlug") private var currentSlug = ""
    @State private var isSwitcherPresented = false
    @State private var scrollPosition = ScrollPosition(edge: .top)
    @FocusState private var isContentFocused: Bool

    var body: some View {
        let page = index.page(slug: currentSlug)

        ScrollView {
            PageRouter(page: page)
                .padding(24)
                .padding(.bottom, 72) // 给右下角浮窗按钮留出位置
                .frame(maxWidth: .infinity, alignment: .leading)
        }
        .scrollPosition($scrollPosition)
        // 内容区可获得焦点，点击空白处即可把焦点收回来，← → 才能翻页。
        .focusable(interactions: .edit)
        .focusEffectDisabled()
        .focused($isContentFocused)
        .onKeyPress(.leftArrow) { turnPage(by: -1) }
        .onKeyPress(.rightArrow) { turnPage(by: 1) }
        .overlay {
            if isSwitcherPresented {
                SwitcherPanel(index: index, currentSlug: page.slug, onSelect: select, onClose: closeSwitcher)
            }
        }
        .overlay(alignment: .bottomTrailing) {
            FloatingSwitcherButton(action: toggleSwitcher)
                .padding(20)
        }
        .navigationTitle(page.name)
        .navigationSubtitle("\(page.category) \(page.categoryLabel)")
        .onAppear { isContentFocused = true }
        .onChange(of: currentSlug) {
            scrollPosition.scrollTo(edge: .top)
        }
    }

    private func turnPage(by offset: Int) -> KeyPress.Result {
        guard !isSwitcherPresented else { return .ignored }
        currentSlug = index.neighbor(of: index.page(slug: currentSlug).slug, offset: offset).slug
        return .handled
    }

    private func select(_ page: Page) {
        currentSlug = page.slug
        closeSwitcher()
    }

    private func toggleSwitcher() {
        if isSwitcherPresented {
            closeSwitcher()
        } else {
            isSwitcherPresented = true
        }
    }

    private func closeSwitcher() {
        isSwitcherPresented = false
        isContentFocused = true
    }
}
