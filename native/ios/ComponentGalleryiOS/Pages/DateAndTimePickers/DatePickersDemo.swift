import SwiftUI

/// Date and time - Pickers：Inline（图形日历）与 Compact。
struct DatePickersDemo: View {
    @State private var inline = Date.now
    @State private var compact = Date.now

    var body: some View {
        DemoCase(title: "Style: Inline") {
            DatePicker("日期", selection: $inline)
                .datePickerStyle(.graphical)
        }
        DemoCase(title: "Style: Compact") {
            DatePicker("日期", selection: $compact)
                .datePickerStyle(.compact)
        }
    }
}
