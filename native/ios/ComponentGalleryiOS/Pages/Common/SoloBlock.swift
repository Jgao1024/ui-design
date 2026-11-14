import SwiftUI

/// 独立组件区块：名称、nodeId、设计尺寸、演示。
struct SoloBlock<Content: View>: View {
    let solo: SoloComponent
    @ContentBuilder let content: Content

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(solo.name)
                    .font(.headline)
                Text("\(solo.id) · \(solo.w, format: .number)×\(solo.h, format: .number) pt")
                    .font(.caption.monospaced())
                    .foregroundStyle(.tertiary)
            }

            DemoCard {
                content
            }
        }
    }
}
