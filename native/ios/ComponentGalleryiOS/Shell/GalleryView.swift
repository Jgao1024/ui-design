import SwiftUI

/// 当前页面 + 顶部翻页按钮 + 右下角浮窗按钮 + 切换面板。
struct GalleryView: View {
    let registry: Registry

    @AppStorage(AppScene.lastPageKey) private var currentSlug = ""
    @State private var isSwitcherPresented = false

    var body: some View {
        NavigationStack {
            if let page = registry.page(slug: currentSlug) ?? registry.pages.first {
                PageRouter(page: page, tokens: registry.tokens)
                    .id(page.slug)
                    .toolbar {
                        ToolbarItemGroup(placement: .topBarTrailing) {
                            Button("上一页", systemImage: "chevron.backward", action: showPrevious)
                                .keyboardShortcut(.leftArrow, modifiers: [])
                            Button("下一页", systemImage: "chevron.forward", action: showNext)
                                .keyboardShortcut(.rightArrow, modifiers: [])
                        }
                    }
            }
        }
        .overlay(alignment: .bottomTrailing) {
            SwitcherButton(action: showSwitcher)
                .padding()
        }
        .sheet(isPresented: $isSwitcherPresented) {
            SwitcherPanel(registry: registry, currentSlug: $currentSlug)
        }
    }

    private func showSwitcher() {
        isSwitcherPresented = true
    }

    private func showPrevious() {
        step(-1)
    }

    private func showNext() {
        step(1)
    }

    private func step(_ offset: Int) {
        if let page = registry.page(currentSlug, offset: offset) {
            currentSlug = page.slug
        }
    }
}
