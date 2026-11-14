import SwiftUI

struct ProductBezelsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { _ in
            UnavailableDemo(reason: "设备外框不是控件，也没有对应 API（登记表级别：不做）")
        }
    }
}
