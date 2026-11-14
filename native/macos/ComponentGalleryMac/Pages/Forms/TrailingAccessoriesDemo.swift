import SwiftUI

/// Trailing Accessories 族：分组表单行右侧的 12 种附件，每种一行。
struct TrailingAccessoriesDemo: View {
    @State private var name = "MacBook Pro"
    @State private var isOn = true
    @State private var radio = 0
    @State private var popUp = "自动"
    @State private var isChecked = true

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Form {
                TextField("Text Field", text: $name)
                Toggle("Switch", isOn: $isOn)
                    .toggleStyle(.switch)
                LabeledContent("Stepper") {
                    StepperSample(layout: .insideField)
                }
                Picker("Radio Buttons", selection: $radio) {
                    Text("Label").tag(0)
                    Text("Label").tag(1)
                }
                .pickerStyle(.radioGroup)
                .horizontalRadioGroupLayout()
                Picker("Pop-Up Button", selection: $popUp) {
                    Text("自动").tag("自动")
                    Text("手动").tag("手动")
                }
                LabeledContent("More Button") {
                    Menu("更多", systemImage: "ellipsis") {
                        Button("选项一") {}
                        Button("选项二") {}
                    }
                    .labelStyle(.iconOnly)
                    .menuIndicator(.hidden)
                    .fixedSize()
                }
                LabeledContent("Label + Info Button") {
                    HStack {
                        Text("Label")
                        Button("详细信息", systemImage: "info.circle") {}
                            .labelStyle(.iconOnly)
                            .buttonStyle(.borderless)
                    }
                }
                LabeledContent("Label", value: "Label")
                LabeledContent("Detail Disclosure") {
                    Button("打开详情", systemImage: "chevron.forward") {}
                        .labelStyle(.iconOnly)
                        .buttonStyle(.borderless)
                }
                LabeledContent("Combo Box") {
                    Text("需要 AppKit 桥接，见 Combo Boxes 页")
                        .foregroundStyle(.secondary)
                }
                Toggle("Checkboxes", isOn: $isChecked)
                    .toggleStyle(.checkbox)
                LabeledContent("Button") {
                    Button("Button") {}
                }
            }
            .formStyle(.grouped)
            .scrollDisabled(true)
            .frame(height: 580)

            DemoNotes("Type: Combo Box —— Forms 是「原生」页，规则不允许 AppKit 桥接；组合框的真实控件见 Combo Boxes 页")
        }
    }
}
