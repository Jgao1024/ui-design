import SwiftUI

/// 通知演示的壁纸底板。
struct NotificationBackdrop<Content: View>: View {
    @ContentBuilder let content: Content

    var body: some View {
        VStack(spacing: 12) {
            content
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background {
            SimWallpaper()
        }
        .clipShape(.rect(cornerRadius: 20))
    }
}
