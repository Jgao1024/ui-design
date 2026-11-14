import SwiftUI

struct AlertsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "63:57121": AlertDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "12616:942": AlertTextFieldDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
