import SwiftUI

/// 真实的 `Stepper`，按布局决定是否带数值框。
struct StepperSample: View {
    let layout: StepperLayout

    @State private var value = 5

    var body: some View {
        switch layout {
        case .noField:
            Stepper("数量", value: $value, in: 0...10)
                .labelsHidden()
        case .outsideField:
            HStack(spacing: 4) {
                TextField("数量", value: $value, format: .number)
                    .textFieldStyle(.roundedBorder)
                    .frame(width: 44)
                Stepper("数量", value: $value, in: 0...10)
                    .labelsHidden()
            }
        case .insideField:
            // SwiftUI 没有「步进器嵌在输入框里」的样式：用无边框输入框 + 步进器，外面画一圈输入框边框近似。
            HStack(spacing: 2) {
                TextField("数量", value: $value, format: .number)
                    .textFieldStyle(.plain)
                    .frame(width: 28)
                Stepper("数量", value: $value, in: 0...10)
                    .labelsHidden()
                    .controlSize(.small)
            }
            .padding(.leading, 6)
            .padding(.vertical, 1)
            .overlay {
                RoundedRectangle(cornerRadius: 6)
                    .strokeBorder(.separator)
            }
        }
    }
}
