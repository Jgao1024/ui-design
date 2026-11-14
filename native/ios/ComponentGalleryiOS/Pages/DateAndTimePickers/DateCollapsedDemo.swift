import SwiftUI

/// Date and time - Collapsed：紧凑日期时间胶囊，Default 与 Selected。
struct DateCollapsedDemo: View {
    @State private var date = Date.now

    var body: some View {
        DemoCase(title: "State: Default") {
            DatePicker("提醒时间", selection: $date)
                .datePickerStyle(.compact)
        }
        InteractiveHint(text: "State: Selected：点击日期或时间胶囊后出现选中态与弹出面板")
    }
}
