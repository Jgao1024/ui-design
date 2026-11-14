import SwiftUI

struct ColorWellsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12520": ColorPickerWheelDemo()
            case "4335:11825": ColorPickerDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
