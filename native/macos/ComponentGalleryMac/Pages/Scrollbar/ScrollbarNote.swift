import SwiftUI

/// 滚动条外观跟随系统设置，App 不能强制常显。
struct ScrollbarNote: View {
    var body: some View {
        DemoNotes("滚动条常显 —— 由「系统设置 › 外观 › 显示滚动条」决定；设为「始终」可看到静态外观，否则只在滚动时出现")
    }
}
