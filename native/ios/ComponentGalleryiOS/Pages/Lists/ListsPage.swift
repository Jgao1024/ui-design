import SwiftUI

struct ListsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "550:49677": RowButtonDemo()
            case "550:50430": RowDemo()
            case "48:56457": IndexBarDemo()
            case "550:49969": SwipeRowsDemo()
            case "517:38042": HeaderDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "35:55757": GroupedFooterDemo()
            case "50:56535": SectionTitleDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
