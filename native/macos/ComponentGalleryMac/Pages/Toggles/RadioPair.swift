import SwiftUI

/// `Picker` + `.pickerStyle(.radioGroup)`：选项 1 为 On，选项 2 为 Off。
struct RadioPair: View {
    @Binding var selection: Int

    var body: some View {
        Picker("选项", selection: $selection) {
            Text("On").tag(0)
            Text("Off").tag(1)
        }
        .pickerStyle(.radioGroup)
        .labelsHidden()
        .fixedSize()
    }
}
