import SwiftUI

struct TooltipsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "0:2793": TooltipDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
