import SwiftUI

/// Leading Accessories 族：分组表单行左侧的 8 种内容。
struct LeadingAccessoriesDemo: View {
    @State private var radio = 0
    @State private var largeExpanded = false
    @State private var smallExpanded = false
    @State private var largeChecked = true
    @State private var smallChecked = false

    var body: some View {
        Form {
            Section("Radio Buttons") {
                Picker("选项", selection: $radio) {
                    TitleSubtitle().tag(0)
                    TitleSubtitle().tag(1)
                }
                .pickerStyle(.radioGroup)
                .labelsHidden()
            }

            Section("Symbol · Title and Subtitle · Button") {
                Label("Title", systemImage: "star.fill")
                TitleSubtitle()
                Button("Button") {}
            }

            Section("Disclosure + Large / Small Icon") {
                DisclosureGroup(isExpanded: $largeExpanded) {
                    Text("Label")
                } label: {
                    Label {
                        TitleSubtitle()
                    } icon: {
                        Image(systemName: "folder.fill")
                            .font(.title)
                            .foregroundStyle(.blue)
                    }
                }
                DisclosureGroup(isExpanded: $smallExpanded) {
                    Text("Label")
                } label: {
                    Label("Title", systemImage: "folder.fill")
                }
            }

            Section("Checkbox + Large / Small Icon") {
                Toggle(isOn: $largeChecked) {
                    Label {
                        TitleSubtitle()
                    } icon: {
                        Image(systemName: "doc.fill")
                            .font(.title)
                            .foregroundStyle(.orange)
                    }
                }
                Toggle(isOn: $smallChecked) {
                    Label("Title", systemImage: "doc.fill")
                }
            }
            .toggleStyle(.checkbox)
        }
        .formStyle(.grouped)
        .scrollDisabled(true)
        .frame(height: 620)
    }
}
