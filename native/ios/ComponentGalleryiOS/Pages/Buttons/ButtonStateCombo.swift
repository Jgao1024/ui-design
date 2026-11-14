import Foundation

/// `Is Enabled` × `Destructive` 两个轴的四种组合。
struct ButtonStateCombo: Identifiable {
    let isEnabled: Bool
    let isDestructive: Bool

    var id: String { title }

    var title: String {
        "Is Enabled: \(isEnabled ? "True" : "False") · Destructive: \(isDestructive ? "True" : "False")"
    }

    static let all = [
        ButtonStateCombo(isEnabled: true, isDestructive: false),
        ButtonStateCombo(isEnabled: true, isDestructive: true),
        ButtonStateCombo(isEnabled: false, isDestructive: false),
        ButtonStateCombo(isEnabled: false, isDestructive: true),
    ]
}
