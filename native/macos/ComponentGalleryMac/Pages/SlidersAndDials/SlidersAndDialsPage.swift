import SwiftUI

struct SlidersAndDialsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "121:12408": SliderDemo(isCenterBiased: false)
            case "533:3289": SliderDemo(isCenterBiased: true)
            case "121:12063": DialDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
