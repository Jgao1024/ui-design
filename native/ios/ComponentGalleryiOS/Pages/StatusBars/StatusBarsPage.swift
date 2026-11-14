import SwiftUI

struct StatusBarsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5413:10006":
                ForEach([false, true], id: \.self) { fullScreen in
                    ForEach([true, false], id: \.self) { expanded in
                        DemoCase(title: "Full Screen: \(fullScreen ? "True" : "False") · Menu Expanded: \(expanded ? "True" : "False")") {
                            SimIPadStatusBar(isFullScreen: fullScreen, isMenuExpanded: expanded)
                        }
                    }
                }
            case "12884:7911":
                HStack(alignment: .top, spacing: 32) {
                    DemoCase(title: "Type: Vertical") {
                        SimDuoStatusBar(isVertical: true)
                    }
                    DemoCase(title: "Type: Horizontal") {
                        SimDuoStatusBar(isVertical: false)
                    }
                }
            case "12961:29589":
                StatusBarIPhoneDemo()
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "10465:36399": SimIPadLeadingAccessories()
            case "10465:36393": SimStatusIcons()
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
