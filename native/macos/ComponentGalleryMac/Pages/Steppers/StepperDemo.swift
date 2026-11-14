import SwiftUI

/// Stepper/No Field、Inside Field、Outside Field 三个族共用：State 四列。
struct StepperDemo: View {
    let layout: StepperLayout

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 32) {
                VariantCell("Default") {
                    StepperSample(layout: layout)
                }
                VariantCell("Disabled") {
                    StepperSample(layout: layout)
                        .disabled(true)
                }
                VariantCell("Clicked - Up / Down（按住箭头）") {
                    StepperSample(layout: layout)
                }
            }
            InteractiveHint()
            if layout == .insideField {
                DemoNotes(
                    "State: Clicked - Up、Clicked - Down —— 交互态，无法静态强制",
                    "Inside Field 外框 —— SwiftUI 没有嵌入式步进器样式，外框是自绘边框近似"
                )
            } else {
                DemoNotes("State: Clicked - Up、Clicked - Down —— 交互态，无法静态强制")
            }
        }
    }
}
