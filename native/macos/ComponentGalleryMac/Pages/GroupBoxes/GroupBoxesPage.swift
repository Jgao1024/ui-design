import SwiftUI

struct GroupBoxesPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11265": GroupBoxDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
