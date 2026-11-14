import SwiftUI

struct PopoversPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11291": PopoverDemo()
            case "4336:13199": PopoverButton(placement: PopoverPlacement.all[4])
            default: PlaceholderDemo()
            }
        }
    }
}
