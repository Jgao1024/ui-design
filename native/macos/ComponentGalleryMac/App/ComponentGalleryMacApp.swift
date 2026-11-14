import SwiftUI

@main
struct ComponentGalleryMacApp: App {
    @AppStorage("showsMenuBarExtra") private var showsMenuBarExtra = false

    var body: some Scene {
        WindowGroup("macOS 27 组件展示", id: "main") {
            RootView()
        }
        .defaultSize(width: 1200, height: 800)
        .windowResizability(.contentMinSize)
        .commands {
            GalleryCommands()
        }

        // Windows / Toolbars / Sidebars 页用的示例窗口；工具栏样式是 Scene 级修饰符，所以每种样式一个 WindowGroup。
        WindowGroup("示例窗口", id: ToolbarStyleKind.automatic.windowID, for: WindowDemoConfig.self) { $config in
            DemoWindowContent(config: config ?? WindowDemoConfig(style: .automatic))
        }
        .windowToolbarStyle(.automatic)
        .defaultSize(width: 870, height: 400)

        WindowGroup("示例窗口", id: ToolbarStyleKind.unified.windowID, for: WindowDemoConfig.self) { $config in
            DemoWindowContent(config: config ?? WindowDemoConfig(style: .unified))
        }
        .windowToolbarStyle(.unified)
        .defaultSize(width: 870, height: 400)

        WindowGroup("示例窗口", id: ToolbarStyleKind.unifiedCompact.windowID, for: WindowDemoConfig.self) { $config in
            DemoWindowContent(config: config ?? WindowDemoConfig(style: .unifiedCompact))
        }
        .windowToolbarStyle(.unifiedCompact)
        .defaultSize(width: 870, height: 400)

        WindowGroup("示例窗口", id: ToolbarStyleKind.expanded.windowID, for: WindowDemoConfig.self) { $config in
            DemoWindowContent(config: config ?? WindowDemoConfig(style: .expanded))
        }
        .windowToolbarStyle(.expanded)
        .defaultSize(width: 870, height: 400)

        UtilityWindow("检查器", id: UtilityPanelContent.windowID) {
            UtilityPanelContent()
        }

        MenuBarExtra("组件展示", systemImage: "square.grid.2x2", isInserted: $showsMenuBarExtra) {
            MenuBarExtraContent()
        }
    }
}
