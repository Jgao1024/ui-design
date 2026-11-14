import SwiftUI

struct MaterialsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4363:18594": ScrollEdgeEffectDemo(style: .hard)
            case "4363:18554": ScrollEdgeEffectDemo(style: .soft)
            case "4331:12157": MaterialsDemo()
            case "483:9237": LiquidGlassDemo()
            case "483:9250": LiquidGlassDemo()
            case "483:9263": LiquidGlassSmallDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
