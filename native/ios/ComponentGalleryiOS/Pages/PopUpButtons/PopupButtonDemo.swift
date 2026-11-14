import SwiftUI

/// Popup Button：Is Enabled True / False。
struct PopupButtonDemo: View {
    @State private var sort = "名称"

    private let options = ["名称", "日期", "大小", "种类"]

    var body: some View {
        DemoCase(title: "Is Enabled: True") {
            Picker("排序方式", selection: $sort) {
                ForEach(options, id: \.self) { Text($0) }
            }
            .pickerStyle(.menu)
        }
        DemoCase(title: "Is Enabled: False") {
            Picker("排序方式", selection: .constant("名称")) {
                ForEach(options, id: \.self) { Text($0) }
            }
            .pickerStyle(.menu)
            .disabled(true)
        }
    }
}
