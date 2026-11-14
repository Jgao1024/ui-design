import SwiftUI

struct ComboBoxesPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11951": ComboBoxDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
