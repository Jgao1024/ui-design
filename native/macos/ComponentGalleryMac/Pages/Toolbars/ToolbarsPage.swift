import SwiftUI

struct ToolbarsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:11848": ToolbarSegmentedDemo()
            case "647:1886": ToolbarButtonGroupDemo()
            case "648:4796": ToolbarButtonDemo()
            case "177:10807": ToolbarSearchDemo()
            case "641:1584": ToolbarPullDownDemo()
            case "641:1685": ToolbarPopUpDemo()
            case "204:9979": UtilityPanelTabBarDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
