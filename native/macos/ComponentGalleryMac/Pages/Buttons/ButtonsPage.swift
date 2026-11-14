import SwiftUI

struct ButtonsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "483:5553": ArrowButtonsDemo()
            case "121:11923": ButtonsDemo()
            case "4341:8462": ToggleButtonsDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
