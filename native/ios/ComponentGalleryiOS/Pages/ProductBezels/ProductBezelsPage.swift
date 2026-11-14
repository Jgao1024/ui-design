import SwiftUI

/// Product Bezels（不做）：设备外框没有对应的 SwiftUI API，每个族显示原因，保证目录完整。
struct ProductBezelsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { _ in
            PlaceholderCard(reason: "无法实现：设备外框是营销素材，没有对应的 SwiftUI API")
        } soloDemo: { _ in
            PlaceholderCard(reason: "无法实现：设备外框是营销素材，没有对应的 SwiftUI API")
        }
    }
}
