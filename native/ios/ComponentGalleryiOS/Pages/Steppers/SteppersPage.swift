import SwiftUI

struct SteppersPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { solo in
            switch solo.id {
            case "5415:17699": StepperDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
