import SwiftUI

struct TextFieldsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12220": TextFieldDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
