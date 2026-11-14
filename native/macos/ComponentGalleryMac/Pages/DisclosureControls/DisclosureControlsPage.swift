import SwiftUI

struct DisclosureControlsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12049": DisclosureButtonDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
