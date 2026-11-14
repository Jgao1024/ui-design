import SwiftUI

struct SearchFieldsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "480:760": SearchFieldDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
