import SwiftUI
import UniformTypeIdentifiers

/// 存储对话框演示用的纯文本文稿。
struct SampleTextDocument: FileDocument {
    static let readableContentTypes: [UTType] = [.plainText]

    var text = "macOS 27 组件展示 · 存储对话框示例\n"

    init() {}

    init(configuration: ReadConfiguration) throws {
        guard let data = configuration.file.regularFileContents else {
            throw CocoaError(.fileReadCorruptFile)
        }
        text = String(decoding: data, as: UTF8.self)
    }

    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        FileWrapper(regularFileWithContents: Data(text.utf8))
    }
}
