import SwiftUI

struct SegmentedControlsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12394": SegmentedControlDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
