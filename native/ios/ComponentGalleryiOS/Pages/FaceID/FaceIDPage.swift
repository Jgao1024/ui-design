import SwiftUI

/// Face ID（自绘）：认证界面由系统（LocalAuthentication）绘制，这里只模拟外观。
struct FaceIDPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "123:58236":
                HStack(spacing: 24) {
                    DemoCase(title: "State: Authenticating") {
                        SimFaceID(isSuccess: false)
                    }
                    DemoCase(title: "State: Success") {
                        SimFaceID(isSuccess: true)
                    }
                }
                .padding()
                .frame(maxWidth: .infinity)
                .background {
                    ColorfulBackdrop()
                        .opacity(0.6)
                }
                .clipShape(.rect(cornerRadius: 20))
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { _ in
            PlaceholderCard(reason: "尚未实现")
        }
    }
}
