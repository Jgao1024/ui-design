import Foundation

/// 可在切换面板里分段显示的选项。
protocol SwitcherOption {
    var title: LocalizedStringResource { get }
}

extension ThemeMode: SwitcherOption {}
extension DeviceFilter: SwitcherOption {}
