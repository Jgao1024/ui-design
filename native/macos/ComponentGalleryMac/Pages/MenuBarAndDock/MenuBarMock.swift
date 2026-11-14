import SwiftUI

/// 自绘：菜单栏的模拟外观。Over Dark 用白字，Over Light 用黑字。
struct MenuBarMock: View {
    let isOverDark: Bool

    private let menus: [LocalizedStringResource] = ["文件", "编辑", "显示", "窗口", "帮助"]

    var body: some View {
        HStack(spacing: 18) {
            Image(systemName: "apple.logo")
                .accessibilityLabel("苹果菜单")
            Text("组件展示")
                .bold()
            ForEach(menus.indices, id: \.self) { index in
                Text(menus[index])
            }
            Spacer()
            Image(systemName: "wifi")
                .accessibilityLabel("无线局域网")
            Image(systemName: "battery.75percent")
                .accessibilityLabel("电池")
            Image(systemName: "switch.2")
                .accessibilityLabel("控制中心")
            Text(Date.now, format: .dateTime.weekday().hour().minute())
        }
        .foregroundStyle(isOverDark ? .white : .black)
        .padding(.horizontal, 16)
        .frame(height: 30)
        .environment(\.colorScheme, isOverDark ? .dark : .light)
    }
}
