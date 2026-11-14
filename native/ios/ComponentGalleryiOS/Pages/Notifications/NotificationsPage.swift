import SwiftUI

/// Notifications（自绘）：通知横幅由系统绘制，这里用 SwiftUI 模拟外观。
struct NotificationsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "135:67787":
                ForEach([3, 2, 1], id: \.self) { stack in
                    DemoCase(title: "Stack: \(stack)") {
                        NotificationBackdrop {
                            SimNotification(stackCount: stack)
                        }
                    }
                }
            case "5551:17755":
                NotificationBackdrop {
                    SimNotification(isExpanded: true)
                }
                .overlay {
                    // 展开通知时，系统在其背后压暗并模糊壁纸。
                    Rectangle()
                        .fill(.black.opacity(0.25))
                        .allowsHitTesting(false)
                        .clipShape(.rect(cornerRadius: 20))
                }
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "135:73247":
                NotificationBackdrop {
                    SimNotification()
                    SimNotification()
                    SimNotification()
                }
            case "143:62847":
                NotificationBackdrop {
                    SimNotification(isExpanded: true)
                }
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
