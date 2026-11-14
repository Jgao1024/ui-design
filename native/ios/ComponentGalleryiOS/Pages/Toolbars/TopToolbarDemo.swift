import SwiftUI

/// Toolbar - Top：切换 Style 看真实导航栏；可选附加轴（Tab Bar 或 Sheet）。
struct TopToolbarDemo: View {
    let styles: [TopBarStyle]
    var extra: TopToolbarExtra = .none

    @State private var style = TopBarStyle.standard
    @State private var showsTabBar = false
    @State private var isSheetPresented = false

    var body: some View {
        Picker("Style", selection: $style) {
            ForEach(styles) { Text($0.rawValue).tag($0) }
        }
        .pickerStyle(.menu)

        switch extra {
        case .none:
            EmptyView()
        case .tabBar:
            Toggle("Tab Bar: True", isOn: $showsTabBar)
        case .sheet:
            Button("Sheet: True（以 sheet 打开）", systemImage: "rectangle.bottomhalf.inset.filled", action: presentSheet)
                .buttonStyle(.bordered)
        }

        TopToolbarCanvas(style: style, showsTabBar: showsTabBar)
            .id("\(style.rawValue)-\(showsTabBar)")
            .frame(height: 380)
            .clipShape(.rect(cornerRadius: 16))
            .sheet(isPresented: $isSheetPresented) {
                SheetToolbarContent(style: style)
            }
    }

    private func presentSheet() {
        isSheetPresented = true
    }
}
