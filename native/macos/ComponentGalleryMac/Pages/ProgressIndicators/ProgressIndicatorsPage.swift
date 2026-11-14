import SwiftUI

struct ProgressIndicatorsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4349:11606": SpinnerDemo()
            case "4349:10450": CircularDeterminateDemo()
            case "488:144": LinearIndeterminateDemo()
            case "121:12208": LinearDeterminateDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
