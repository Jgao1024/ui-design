import SwiftUI

/// Page Control：Pages 1-6、7、8+。8 页以上时系统会把两端的点缩小。
struct PageControlDemo: View {
    var body: some View {
        DemoCase(title: "Pages: 1-6（5 页）") {
            PagedSample(pageCount: 5)
        }
        DemoCase(title: "Pages: 7") {
            PagedSample(pageCount: 7)
        }
        DemoCase(title: "Pages: 8+（12 页）") {
            PagedSample(pageCount: 12)
        }
    }
}
