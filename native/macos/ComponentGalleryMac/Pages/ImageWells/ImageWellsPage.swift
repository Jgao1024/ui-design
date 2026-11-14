import SwiftUI

struct ImageWellsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12528": ImageWellDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
