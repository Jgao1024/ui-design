import SwiftUI

struct NotificationsPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4358:11429": NotificationDemo()
            case "4358:11539": GlassNotificationDemo(colorScheme: .dark)
            case "4358:11549": GlassNotificationDemo(colorScheme: .light)
            default: PlaceholderDemo()
            }
        }
    }
}
