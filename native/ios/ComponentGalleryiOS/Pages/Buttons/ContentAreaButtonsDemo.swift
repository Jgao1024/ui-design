import SwiftUI

/// Button - Content Area：Style × Size × Label Style × Is Enabled × Destructive，108 个变体全部静态展示。
struct ContentAreaButtonsDemo: View {
    private let kinds: [DemoButtonKind] = [.borderless, .bordered, .borderedProminent]

    var body: some View {
        ForEach(ButtonStateCombo.all) { combo in
            VStack(alignment: .leading, spacing: 12) {
                Text(combo.title)
                    .font(.subheadline)
                    .bold()
                ForEach(kinds) { kind in
                    ForEach(DemoButtonSize.allCases) { size in
                        DemoCase(title: "\(kind.title) · \(size.title)") {
                            HStack(spacing: 12) {
                                ForEach(DemoLabelMode.allCases) { label in
                                    StyledDemoButton(kind: kind, size: size, label: label,
                                                     isDestructive: combo.isDestructive, isEnabled: combo.isEnabled)
                                }
                            }
                        }
                    }
                }
            }
            Divider()
        }
        Text("每行从左到右：Icon only、Title only、Title and Icon")
            .font(.caption)
            .foregroundStyle(.secondary)
    }
}
