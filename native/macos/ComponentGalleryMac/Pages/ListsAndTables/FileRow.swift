import Foundation

/// 表格和大纲视图的示例数据。
struct FileRow: Identifiable, Hashable {
    let id: String
    let kind: String
    let size: String
    var children: [FileRow]?

    var name: String { id }

    /// 平铺的示例行，供排序和列标题演示。
    static let samples: [FileRow] = [
        FileRow(id: "README.md", kind: "Markdown", size: "4 KB"),
        FileRow(id: "Assets", kind: "文件夹", size: "—"),
        FileRow(id: "main.swift", kind: "Swift 源代码", size: "1 KB"),
        FileRow(id: "Package.swift", kind: "Swift 源代码", size: "2 KB"),
    ]

    /// 五层嵌套（Level 0–4）的大纲示例。
    static let outline: [FileRow] = [
        FileRow(id: "项目", kind: "文件夹", size: "—", children: [
            FileRow(id: "源代码", kind: "文件夹", size: "—", children: [
                FileRow(id: "页面", kind: "文件夹", size: "—", children: [
                    FileRow(id: "控件", kind: "文件夹", size: "—", children: [
                        FileRow(id: "ButtonsPage.swift", kind: "Swift 源代码", size: "1 KB"),
                    ]),
                ]),
            ]),
        ]),
        FileRow(id: "文档", kind: "文件夹", size: "—", children: [
            FileRow(id: "登记表.md", kind: "Markdown", size: "30 KB"),
        ]),
        FileRow(id: "LICENSE", kind: "纯文本", size: "1 KB"),
    ]
}
