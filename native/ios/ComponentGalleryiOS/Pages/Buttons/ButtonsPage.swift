import SwiftUI

struct ButtonsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "40:58696": ContentAreaButtonsDemo()
            case "5473:21667": GlassTextButtonsDemo()
            case "5522:11866": GlassSymbolButtonsDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
