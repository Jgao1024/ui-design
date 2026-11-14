import SwiftUI

struct PointersPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "2302:7096": PointersDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
