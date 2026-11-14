import SwiftUI

struct MaterialsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5661:26943": ScrollEdgeDemo(style: .soft)
            case "5661:26978": ScrollEdgeDemo(style: .hard)
            case "5584:32504": GlassDemo(size: .large)
            case "5584:32503": GlassDemo(size: .medium)
            case "5584:32505": GlassDemo(size: .small)
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "5914:23547": GlassDemo(size: .clear)
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
