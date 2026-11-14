import SwiftUI

struct SlidersPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "7:53847": SlidersDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
