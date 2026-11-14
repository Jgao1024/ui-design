import SwiftUI

struct SteppersPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12079": StepperDemo(layout: .noField)
            case "540:1629": StepperDemo(layout: .insideField)
            case "540:4659": StepperDemo(layout: .outsideField)
            default: PlaceholderDemo()
            }
        }
    }
}
