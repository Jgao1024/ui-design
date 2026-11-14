import SwiftUI

/// Notification 族（自绘）：Stack False 单条，Stack True 为堆叠的多条通知。
struct NotificationDemo: View {
    var body: some View {
        HStack(alignment: .top, spacing: 32) {
            VariantCell("Stack: False") {
                NotificationBanner()
                    .padding(24)
                    .background { WallpaperBackdrop() }
                    .clipShape(.rect(cornerRadius: 12))
            }
            VariantCell("Stack: True") {
                ZStack(alignment: .top) {
                    NotificationBanner(title: "信息", message: "另一条较早的通知")
                        .scaleEffect(0.92)
                        .offset(y: 16)
                        .opacity(0.7)
                    NotificationBanner()
                }
                .padding(.horizontal, 24)
                .padding(.top, 24)
                .padding(.bottom, 40)
                .background { WallpaperBackdrop() }
                .clipShape(.rect(cornerRadius: 12))
            }
        }
    }
}
