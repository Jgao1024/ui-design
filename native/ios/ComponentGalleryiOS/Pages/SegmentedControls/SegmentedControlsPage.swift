import SwiftUI

struct SegmentedControlsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "10460:145": SegmentedControlDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
