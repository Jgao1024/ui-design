import SwiftUI

/// 桥接：SwiftUI 没有圆形滑块，用 `NSSlider`（`sliderType = .circular`）包装。
/// 登记表里 Sliders and Dials 页级别为「部分」，允许使用 AppKit。
struct DialView: NSViewRepresentable {
    @Binding var value: Double

    func makeNSView(context: Context) -> NSSlider {
        let slider = NSSlider(value: value, minValue: 0, maxValue: 1, target: context.coordinator, action: #selector(Coordinator.valueChanged(_:)))
        slider.sliderType = .circular
        return slider
    }

    func updateNSView(_ slider: NSSlider, context: Context) {
        slider.doubleValue = value
        slider.isEnabled = context.environment.isEnabled
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(value: $value)
    }

    @MainActor
    final class Coordinator: NSObject {
        private let value: Binding<Double>

        init(value: Binding<Double>) {
            self.value = value
        }

        @objc func valueChanged(_ sender: NSSlider) {
            value.wrappedValue = sender.doubleValue
        }
    }
}
