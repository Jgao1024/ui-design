import SwiftUI

/// Menu Bar 族：真实菜单栏在屏幕顶部（`.commands` / `CommandMenu` / `MenuBarExtra`）；页内是 Over Dark / Over Light 的模拟外观。
struct MenuBarDemo: View {
    @AppStorage("showsMenuBarExtra") private var showsMenuBarExtra = false

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("屏幕顶部本 App 的菜单栏里有一个「示例菜单」，由 `CommandMenu` 生成。")
                .font(.callout)
            Toggle("在系统菜单栏右侧显示 MenuBarExtra 图标", isOn: $showsMenuBarExtra)
                .toggleStyle(.switch)

            VariantCell("Color Mode: Over Dark（模拟）") {
                MenuBarMock(isOverDark: true)
                    .background { WallpaperBackdrop().environment(\.colorScheme, .dark) }
                    .clipShape(.rect(cornerRadius: 6))
            }
            VariantCell("Color Mode: Over Light（模拟）") {
                MenuBarMock(isOverDark: false)
                    .background { WallpaperBackdrop().environment(\.colorScheme, .light) }
                    .clipShape(.rect(cornerRadius: 6))
            }

            DemoNotes("页内菜单栏 —— 菜单栏由系统绘制，App 只能往里加菜单（CommandMenu）和状态栏图标（MenuBarExtra），页内是自绘模拟")
        }
    }
}
