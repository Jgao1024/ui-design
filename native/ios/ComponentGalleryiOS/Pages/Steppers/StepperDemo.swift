import SwiftUI

struct StepperDemo: View {
    @State private var value = 3

    var body: some View {
        Stepper("数量：\(value)", value: $value, in: 0...10)
        Text("到达 0 或 10 时，对应的减号或加号自动变为禁用态。")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
