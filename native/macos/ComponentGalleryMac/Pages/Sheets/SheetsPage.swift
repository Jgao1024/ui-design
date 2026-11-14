import SwiftUI

struct SheetsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4358:15435": SheetDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
