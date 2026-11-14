import SwiftUI

struct FormsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12986": TrailingAccessoriesDemo()
            case "121:12901": LeadingAccessoriesDemo()
            case "4356:9283": FormDemo()
            case "4356:9291": FormRowDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
