import SwiftUI

/// 表单（Sheet）里的内容，带「完成」按钮关闭。
struct SheetContent: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("新建文件夹")
                .font(.headline)
            TextField("名称", text: $name)
            HStack {
                Spacer()
                Button("取消", role: .cancel, action: close)
                Button("创建", action: close)
                    .keyboardShortcut(.defaultAction)
            }
        }
        .padding(20)
        .frame(width: 320)
    }

    private func close() {
        dismiss()
    }
}
