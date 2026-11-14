import SwiftUI

struct SidebarsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "10472:45236": SidebarBGDemo()
            case "131:70029": SidebarRowDemo()
            case "10464:33764": SidebarDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "131:66427": SidebarSectionHeaderDemo()
            case "5840:30516": SidebarSearchFieldDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
