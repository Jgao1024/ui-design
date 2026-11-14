import SwiftUI

/// Slider 与 Slider - Center-biased 族：Ticks 拆成两个子网格，每个子网格再对比 Active。
struct SliderDemo: View {
    let isCenterBiased: Bool

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            AxisLabel("Ticks: False")
            ActiveComparison {
                SliderGrid(showsTicks: false, isCenterBiased: isCenterBiased)
            }

            AxisLabel("Ticks: True")
            ActiveComparison {
                SliderGrid(showsTicks: true, isCenterBiased: isCenterBiased)
            }

            InteractiveHint(text: "Clicked：在最右列按住旋钮拖动")
            DemoNotes("State: Clicked —— 交互态，无法静态强制")
        }
    }
}
