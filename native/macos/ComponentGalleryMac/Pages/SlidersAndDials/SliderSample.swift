import SwiftUI

/// 一个真实的 `Slider`。Ticks 用 `SliderTick` 画刻度；Center-biased 用 `neutralValue: 0.5` 从中点开始填充。
struct SliderSample: View {
    let showsTicks: Bool
    let isCenterBiased: Bool

    @State private var value: Double

    init(value: Double, showsTicks: Bool, isCenterBiased: Bool) {
        self.showsTicks = showsTicks
        self.isCenterBiased = isCenterBiased
        _value = State(initialValue: value)
    }

    var body: some View {
        Slider(value: $value, in: 0...1, neutralValue: isCenterBiased ? 0.5 : nil) {
            Text("值")
        } ticks: {
            SliderTickContentForEach(showsTicks ? ProgressValues.all : [], id: \.self) { tick in
                SliderTick(tick)
            }
        }
        .labelsHidden()
        .frame(width: 120)
    }
}
