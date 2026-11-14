import SwiftUI

struct SwitcherRow: View {
    let page: RegistryPage
    let isCurrent: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            LabeledContent {
                Text("\(page.sets.count) 族")
                    .monospacedDigit()
            } label: {
                Label {
                    Text(page.name)
                    Text("SwiftUI：\(page.level.rawValue)")
                } icon: {
                    Image(systemName: isCurrent ? "checkmark.circle.fill" : "circle")
                        .foregroundStyle(isCurrent ? AnyShapeStyle(.tint) : AnyShapeStyle(.tertiary))
                }
            }
        }
        .tint(.primary)
        .accessibilityAddTraits(isCurrent ? .isSelected : [])
    }
}
