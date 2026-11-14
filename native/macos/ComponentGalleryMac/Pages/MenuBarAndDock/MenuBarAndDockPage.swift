import SwiftUI

struct MenuBarAndDockPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:13310": DesktopWallpaperDemo()
            case "121:13196": MenuBarDemo()
            case "121:13243": DesktopTemplateDemo()
            case "4355:8233": DockDemo()
            case "4355:8583": DockIconDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
