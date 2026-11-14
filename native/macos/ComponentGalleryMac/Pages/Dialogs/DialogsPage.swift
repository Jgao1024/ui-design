import SwiftUI

struct DialogsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "682:4331": SystemOverlayNote()
            case "174:9424": SaveDialogDemo(isLarge: true)
            case "171:9049": SaveDialogDemo(isLarge: false)
            default: PlaceholderDemo()
            }
        }
    }
}
