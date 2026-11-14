import SwiftUI

/// Home Screen 族：每个变体按设计尺寸画一张模拟主屏幕。
struct HomeScreenFamilyDemo: View {
    let family: ComponentSet
    let defaultColumns: Int

    var body: some View {
        let widgetsAxis = family.axes.firstIndex { $0.name == "Widgets" }
        let displayAxis = family.axes.firstIndex { $0.name == "Display" }

        ForEach(family.kids) { kid in
            DemoCase(title: "\(kid.values.joined(separator: " · "))") {
                SimHomeScreen(
                    width: kid.w,
                    height: kid.h,
                    columns: displayAxis.flatMap { DuoDisplay(rawValue: kid.values[$0])?.columns } ?? defaultColumns,
                    widget: widgetsAxis.flatMap { SimWidgetSize(figmaValue: kid.values[$0]) }
                )
            }
        }
    }
}
