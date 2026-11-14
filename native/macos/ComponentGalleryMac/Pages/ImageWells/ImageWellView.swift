import SwiftUI

/// 桥接：可编辑图片框用 `NSImageView`（`isEditable` + `grayBezel` 边框），可以把图片拖进来替换。
/// 登记表级别为「桥接」，允许使用 AppKit。
struct ImageWellView: NSViewRepresentable {
    func makeNSView(context: Context) -> NSImageView {
        let imageView = NSImageView()
        imageView.imageFrameStyle = .grayBezel
        imageView.isEditable = true
        imageView.imageScaling = .scaleProportionallyUpOrDown
        imageView.image = NSImage(systemSymbolName: "photo", accessibilityDescription: String(localized: "示例图片"))
        return imageView
    }

    func updateNSView(_ imageView: NSImageView, context: Context) {
        imageView.isEnabled = context.environment.isEnabled
    }
}
