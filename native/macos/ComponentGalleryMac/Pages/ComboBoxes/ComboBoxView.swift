import SwiftUI

/// 桥接：SwiftUI 没有组合框，用 `NSComboBox` 包装。登记表级别为「桥接」，允许使用 AppKit。
struct ComboBoxView: NSViewRepresentable {
    let items: [String]
    @Binding var text: String

    func makeNSView(context: Context) -> NSComboBox {
        let comboBox = NSComboBox()
        comboBox.addItems(withObjectValues: items)
        comboBox.stringValue = text
        comboBox.delegate = context.coordinator
        comboBox.completes = true
        return comboBox
    }

    func updateNSView(_ comboBox: NSComboBox, context: Context) {
        if comboBox.stringValue != text {
            comboBox.stringValue = text
        }
        comboBox.isEnabled = context.environment.isEnabled
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(text: $text)
    }

    @MainActor
    final class Coordinator: NSObject, NSComboBoxDelegate {
        private let text: Binding<String>

        init(text: Binding<String>) {
            self.text = text
        }

        func controlTextDidChange(_ notification: Notification) {
            guard let comboBox = notification.object as? NSComboBox else { return }
            text.wrappedValue = comboBox.stringValue
        }

        func comboBoxSelectionDidChange(_ notification: Notification) {
            guard let comboBox = notification.object as? NSComboBox,
                  let value = comboBox.objectValueOfSelectedItem as? String else { return }
            text.wrappedValue = value
        }
    }
}
