import SwiftUI

/// Group Box 独立组件：`GroupBox`。
struct GroupBoxDemo: View {
    @State private var showsHidden = false
    @State private var sortsFolders = true

    var body: some View {
        GroupBox("显示选项") {
            VStack(alignment: .leading, spacing: 8) {
                Toggle("显示隐藏文件", isOn: $showsHidden)
                Toggle("文件夹排在最前", isOn: $sortsFolders)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(width: 280)
    }
}
