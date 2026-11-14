import SwiftUI

struct ProgressIndicatorsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "9:55875": DeterminateProgressDemo()
            case "5425:3431": SpinnerDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
