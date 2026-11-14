import SwiftUI

/// Action Sheet：.confirmationDialog，挂在触发按钮上，Liquid Glass 从按钮处展开。
struct ActionSheetDemo: View {
    @State private var isPresented = false

    var body: some View {
        Button("删除照片", systemImage: "trash", role: .destructive, action: present)
            .buttonStyle(.bordered)
            .confirmationDialog("这张照片将从所有设备上删除。", isPresented: $isPresented, titleVisibility: .visible) {
                Button("删除照片", role: .destructive) {}
                Button("取消", role: .cancel) {}
            }
        InteractiveHint(text: "点击按钮弹出系统操作表")
    }

    private func present() {
        isPresented = true
    }
}
