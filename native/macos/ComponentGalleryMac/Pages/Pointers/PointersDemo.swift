import SwiftUI

/// Pointers 族：每种指针一个悬停区域。
struct PointersDemo: View {
    private let columns = [GridItem(.adaptive(minimum: 220), spacing: 12)]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            InteractiveHint(text: "把指针移到各个方块上查看真实系统指针")
            LazyVGrid(columns: columns, spacing: 12) {
                ForEach(PointerSample.all) { sample in
                    PointerTile(sample: sample)
                }
            }
            DemoNotes(
                "Type: Move —— SwiftUI 的 PointerStyle 没有四向移动指针",
                "Type: Beachball —— 彩虹圈由系统在 App 无响应时显示，App 不能主动设置",
                "Type: Default with Menu Badge —— 带菜单角标的箭头没有公开 API"
            )
        }
    }
}
