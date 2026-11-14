import SwiftUI

struct TogglesPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12161": SwitchesDemo()
            case "121:12141": RadioButtonsDemo()
            case "497:3757": CheckboxesDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
