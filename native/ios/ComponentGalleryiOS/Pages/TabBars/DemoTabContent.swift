import SwiftUI

/// 每个标签页里的可滚动内容，向下滚动可触发标签栏最小化。
struct DemoTabContent: View {
    let title: LocalizedStringResource

    var body: some View {
        List(1...30, id: \.self) { row in
            Text("\(title) · 第 \(row) 行")
        }
    }
}
