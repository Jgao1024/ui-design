import SwiftUI

struct ScrollbarPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "497:6481": ScrollbarVerticalDemo()
            case "497:6567": ScrollbarHorizontalDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
