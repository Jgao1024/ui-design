import Foundation

/// 主屏幕小组件尺寸（Figma `Size` / `Widgets` 轴）。
enum SimWidgetSize: String {
    case small = "Small"
    case medium = "Medium"
    case large = "Large"
    case extraLarge = "Extra Large"

    /// 接受 Figma 里的 "XL" 写法。
    init?(figmaValue: String) {
        if figmaValue == "XL" {
            self = .extraLarge
        } else {
            self.init(rawValue: figmaValue)
        }
    }
}
