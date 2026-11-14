import SwiftUI

struct SegmentedSample: View {
    let size: ControlSize
    let isEnabled: Bool

    @State private var selection = "日"

    var body: some View {
        Picker("时间范围", selection: $selection) {
            ForEach(["日", "周", "月", "年"], id: \.self) { Text($0) }
        }
        .pickerStyle(.segmented)
        .controlSize(size)
        .disabled(isEnabled == false)
    }
}
