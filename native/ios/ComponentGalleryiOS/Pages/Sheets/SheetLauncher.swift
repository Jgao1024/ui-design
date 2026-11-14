import SwiftUI

/// 打开一个指定 detent 的真实 sheet。
struct SheetLauncher: View {
    let option: SheetDetentOption
    /// iPad 上用表单尺寸（.presentationSizing(.form)）；对每个实例固定不变。
    var usesFormSizing = false

    @State private var isPresented = false

    var body: some View {
        Button("Detent: \(option.rawValue)", systemImage: "rectangle.bottomhalf.inset.filled", action: present)
            .buttonStyle(.bordered)
            .sheet(isPresented: $isPresented) {
                if usesFormSizing {
                    SheetBody(option: option)
                        .presentationSizing(.form)
                } else {
                    SheetBody(option: option)
                }
            }
    }

    private func present() {
        isPresented = true
    }
}
