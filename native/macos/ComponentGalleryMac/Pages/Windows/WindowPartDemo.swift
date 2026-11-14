import SwiftUI

/// 窗口自带的部件（红绿灯、标题）：不能单独放进页面，用按钮打开真实窗口查看。
struct WindowPartDemo: View {
    let explanation: LocalizedStringResource
    let configs: [WindowDemoConfig]
    var showsUtilityPanel = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(spacing: 12) {
                ForEach(configs) { config in
                    OpenDemoWindowButton(config: config)
                }
                if showsUtilityPanel {
                    OpenUtilityPanelButton()
                }
            }
            Text(explanation)
                .font(.callout)
                .foregroundStyle(.secondary)
        }
    }
}
