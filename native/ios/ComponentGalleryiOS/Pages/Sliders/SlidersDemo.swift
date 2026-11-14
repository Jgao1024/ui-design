import SwiftUI

/// Sliders：State Idle / Disabled / Pressed × Value 100%–0%。
struct SlidersDemo: View {
    private static let presets: [Double] = [1, 0.75, 0.5, 0.25, 0]

    @State private var values = SlidersDemo.presets
    @State private var pressed = 0.5

    var body: some View {
        Text("State: Idle")
            .font(.subheadline)
            .bold()
        ForEach(values.indices, id: \.self) { index in
            DemoCase(title: "Value: \(Self.presets[index], format: .percent)") {
                Slider(value: $values[index])
            }
        }

        Text("State: Disabled")
            .font(.subheadline)
            .bold()
        ForEach(Self.presets, id: \.self) { value in
            DemoCase(title: "Value: \(value, format: .percent)") {
                Slider(value: .constant(value))
                    .disabled(true)
            }
        }

        Text("State: Pressed")
            .font(.subheadline)
            .bold()
        Slider(value: $pressed)
        InteractiveHint(text: "交互态，请手动按住滑块")
    }
}
