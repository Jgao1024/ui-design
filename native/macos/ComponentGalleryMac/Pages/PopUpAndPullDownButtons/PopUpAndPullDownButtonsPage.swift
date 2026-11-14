import SwiftUI

struct PopUpAndPullDownButtonsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11978": PopUpButtonDemo()
            case "202:2935": PulldownButtonDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
