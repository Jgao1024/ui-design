import SwiftUI

/// 面板里的分段选择器：标题在上，分段控件在下，窄屏也放得下。
struct SwitcherPicker<Option: CaseIterable & Identifiable & Hashable>: View
where Option.AllCases: RandomAccessCollection, Option: SwitcherOption {
    let title: LocalizedStringResource
    @Binding var selection: Option

    var body: some View {
        VStack(alignment: .leading) {
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.secondary)
            Picker(title, selection: $selection) {
                ForEach(Option.allCases) { option in
                    Text(option.title).tag(option)
                }
            }
            .pickerStyle(.segmented)
            .labelsHidden()
        }
    }
}
