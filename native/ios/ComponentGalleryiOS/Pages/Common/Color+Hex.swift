import SwiftUI

extension Color {
    /// 由 "#RRGGBB" 与透明度构造颜色；格式不对时返回透明色。
    init(hex: String, alpha: Double = 1) {
        let digits = hex.trimmingPrefix("#")
        guard digits.count == 6, let value = UInt32(digits, radix: 16) else {
            self = .clear
            return
        }
        self.init(
            .sRGB,
            red: Double((value >> 16) & 0xFF) / 255,
            green: Double((value >> 8) & 0xFF) / 255,
            blue: Double(value & 0xFF) / 255,
            opacity: alpha
        )
    }
}
