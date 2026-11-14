import SwiftUI

/// System（自绘）：主屏幕、锁屏、控制中心、壁纸、Home 指示条都由系统进程绘制，这里用 SwiftUI 模拟外观。
struct SystemPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "595:43249": HomeScreenFamilyDemo(family: family, defaultColumns: 6)
            case "13138:22625": HomeScreenFamilyDemo(family: family, defaultColumns: 4)
            case "561:5800": HomeScreenFamilyDemo(family: family, defaultColumns: 4)
            case "106:60033": HomeIndicatorDemo(family: family)
            case "5707:9420", "13138:25373", "5707:11471": WallpaperFamilyDemo(family: family)
            case "13148:36338", "2402:17543": AppIconFamilyDemo()
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "2607:25388", "2607:25374": QuickActionsDemo()
            case "2606:21776", "2524:24489": SimControlCenter(width: solo.w, height: solo.h)
            case "557:20781", "557:20840": SimLockScreen(width: solo.w, height: solo.h)
            case "12887:18298": SimOuterLens()
            case "5592:39416": SimAppIcon(systemImage: "message.fill", tint: .green, size: 72, badge: 3)
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
