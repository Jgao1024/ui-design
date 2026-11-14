import SwiftUI

/// 切换面板：搜索、设备筛选、明暗开关、按分类列出全部页面。
struct SwitcherPanel: View {
    let registry: Registry
    @Binding var currentSlug: String

    @AppStorage(AppScene.themeKey) private var theme: ThemeMode = .system
    @AppStorage(AppScene.deviceFilterKey) private var device: DeviceFilter = .iPhone
    @Environment(\.dismiss) private var dismiss
    @State private var query = ""

    private var groups: [PageGroup] {
        registry.categories.compactMap { category in
            let pages = registry.pages(in: category).filter { $0.matches(query) }
            return pages.isEmpty ? nil : PageGroup(category: category, pages: pages)
        }
    }

    var body: some View {
        NavigationStack {
            List {
                Section("显示") {
                    SwitcherPicker(title: "外观", selection: $theme)
                    SwitcherPicker(title: "设备", selection: $device)
                }

                ForEach(groups) { group in
                    Section("\(group.category.id) \(group.category.label)") {
                        ForEach(group.pages) { page in
                            SwitcherRow(page: page, isCurrent: page.slug == currentSlug) {
                                select(page)
                            }
                        }
                    }
                }
            }
            .overlay {
                if groups.isEmpty {
                    ContentUnavailableView.search
                }
            }
            .searchable(text: $query, prompt: "页面名或组件族名")
            .navigationTitle("切换页面")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("关闭", systemImage: "xmark", action: close)
                }
            }
        }
        .presentationDetents([.medium, .large])
        .preferredColorScheme(theme.colorScheme)
    }

    private func select(_ page: RegistryPage) {
        currentSlug = page.slug
        dismiss()
    }

    private func close() {
        dismiss()
    }
}
