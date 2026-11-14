import SwiftUI

/// Popover 族：12 种 Edge，每种一个按钮。
struct PopoverDemo: View {
    private let columns = [GridItem(.adaptive(minimum: 170), spacing: 16)]

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            LazyVGrid(columns: columns, alignment: .leading, spacing: 16) {
                ForEach(PopoverPlacement.all) { placement in
                    PopoverButton(placement: placement)
                }
            }
            DemoNotes("Edge 括号里的位置（Top / Middle / Bottom、Leading / Center / Trailing）—— 箭头在气泡边上的位置由系统按可用空间决定；SwiftUI 只能指定 arrowEdge 和锚点，所以 8 个变体只能近似")
        }
    }
}
