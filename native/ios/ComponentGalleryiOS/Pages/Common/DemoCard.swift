import SwiftUI

/// 演示内容的底板。
struct DemoCard<Content: View>: View {
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(.fill.quinary, in: .rect(cornerRadius: 20))
    }
}
