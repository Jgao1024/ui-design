import SwiftUI

/// Index Bar：分区索引条，iPhone 与 iPad 用同一 API。
struct IndexBarDemo: View {
    private let letters = (UnicodeScalar("A").value...UnicodeScalar("Z").value)
        .compactMap { UnicodeScalar($0).map { String(Character($0)) } }

    var body: some View {
        List {
            ForEach(letters, id: \.self) { letter in
                Section(letter) {
                    Text("\(letter) 开头的联系人 1")
                    Text("\(letter) 开头的联系人 2")
                }
                .sectionIndexLabel(letter)
            }
        }
        .listStyle(.plain)
        .listSectionIndexVisibility(.visible)
        .frame(height: 380)
        InteractiveHint(text: "在右侧索引条上按住滑动可快速跳转；Device 轴（iPad / iPhone）由运行设备决定")
    }
}
