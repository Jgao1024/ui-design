import SwiftUI

struct ActionSheetsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "尚未实现")
        } soloDemo: { solo in
            switch solo.id {
            case "5446:10266": ActionSheetDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
