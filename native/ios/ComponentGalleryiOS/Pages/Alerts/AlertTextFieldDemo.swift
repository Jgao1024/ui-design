import SwiftUI

/// 带输入框的提醒。
struct AlertTextFieldDemo: View {
    @State private var isPresented = false
    @State private var name = ""

    var body: some View {
        Button("重命名", systemImage: "pencil", action: present)
            .buttonStyle(.bordered)
            .alert("重命名文件夹", isPresented: $isPresented) {
                TextField("名称", text: $name)
                Button("取消", role: .cancel) {}
                Button("好") {}
            }
        InteractiveHint(text: "点击按钮弹出带输入框的提醒")
    }

    private func present() {
        isPresented = true
    }
}
