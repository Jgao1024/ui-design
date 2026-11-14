import SwiftUI

/// Large / Small 独立组件：真实的存储对话框（`.fileExporter`）。
/// 对话框的展开（Large）和收起（Small）由用户点对话框里的箭头切换，App 无法指定。
struct SaveDialogDemo: View {
    let isLarge: Bool

    @State private var isExporterPresented = false
    @State private var result: String?

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button(isLarge ? "打开存储对话框（展开为 Large）" : "打开存储对话框（收起为 Small）", systemImage: "square.and.arrow.down", action: present)
                .fileExporter(
                    isPresented: $isExporterPresented,
                    document: SampleTextDocument(),
                    contentType: .plainText,
                    defaultFilename: "示例.txt",
                    onCompletion: handle
                )
            if let result {
                Text(result)
                    .font(.callout)
                    .foregroundStyle(.secondary)
            }
            DemoNotes(isLarge
                ? "展开态 —— 由用户点对话框文件名旁的箭头展开，App 不能指定"
                : "收起态 —— 由用户点对话框文件名旁的箭头收起，App 不能指定")
        }
    }

    private func present() {
        isExporterPresented = true
    }

    private func handle(_ outcome: Result<URL, Error>) {
        switch outcome {
        case .success(let url):
            result = String(localized: "已存储到 \(url.path(percentEncoded: false))")
        case .failure(let error):
            result = String(localized: "存储失败：\(error.localizedDescription)")
        }
    }
}
