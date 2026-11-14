import SwiftUI

struct SidebarsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "655:2306": SidebarItemDemo()
            case "195:8503": SectionHeaderDemo()
            case "656:3559": SidebarsComposedDemo()
            case "4358:9901": SidebarWindowControlsDemo()
            case "4362:1751": SidebarBackgroundDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
