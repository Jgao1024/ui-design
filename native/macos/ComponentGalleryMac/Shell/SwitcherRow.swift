import SwiftUI

/// 切换面板里的一行：页面名、命中的族名、公开族数量。
struct SwitcherRow: View {
    let hit: SearchHit
    let isCurrent: Bool
    let isHighlighted: Bool
    let onSelect: (Page) -> Void

    var body: some View {
        Button(action: select) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(hit.page.name)
                    if !hit.matchedFamilies.isEmpty {
                        Text(hit.matchedFamilies.formatted())
                            .font(.caption)
                            .foregroundStyle(.secondary)
                    }
                }

                Spacer()

                Image(systemName: "checkmark")
                    .foregroundStyle(.tint)
                    .opacity(isCurrent ? 1 : 0)
                    .accessibilityLabel("当前页面")
                    .accessibilityHidden(!isCurrent)

                Text(hit.page.kind == "kit" ? "\(hit.page.families.count) 族" : "令牌")
                    .monospacedDigit()
                    .foregroundStyle(.secondary)
                    .frame(minWidth: 36, alignment: .trailing)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .contentShape(.rect)
            .background(isHighlighted ? AnyShapeStyle(.tint.opacity(0.22)) : AnyShapeStyle(.clear), in: .rect(cornerRadius: 8))
        }
        .buttonStyle(.plain)
    }

    private func select() {
        onSelect(hit.page)
    }
}
