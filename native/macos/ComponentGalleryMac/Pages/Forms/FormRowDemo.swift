import SwiftUI

/// Form Row 独立组件：左侧图标 + 标题副标题，右侧附件。
struct FormRowDemo: View {
    var body: some View {
        Form {
            LabeledContent {
                Text("Detail")
            } label: {
                Label {
                    TitleSubtitle(title: "Label", subtitle: "Subtitle")
                } icon: {
                    Image(systemName: "gearshape.fill")
                        .foregroundStyle(.gray)
                }
            }
        }
        .formStyle(.grouped)
        .scrollDisabled(true)
        .frame(width: 460, height: 90)
    }
}
