import SwiftUI

struct AlertsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11186": AlertDemo()
            case "4335:347": SystemOverlayNote()
            default: PlaceholderDemo()
            }
        }
    }
}
