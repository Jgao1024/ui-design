import SwiftUI

/// 设备筛选隐藏了多少区块，避免静默漏掉。
struct FilteredNote: View {
    let hiddenCount: Int
    let device: DeviceFilter

    var body: some View {
        Label("设备筛选为「\(device.title)」，本页另有 \(hiddenCount) 个区块已隐藏；在切换面板里改为「全部」即可查看", systemImage: "line.3.horizontal.decrease.circle")
            .font(.footnote)
            .foregroundStyle(.secondary)
    }
}
