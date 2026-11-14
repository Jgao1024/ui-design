import SwiftUI

struct SheetsPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5827:57566":
                SheetLauncher(option: .medium)
                Text("sheet 顶部的抓手由 .presentationDragIndicator(.visible) 显示。")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            case "10525:1632":
                ForEach(SheetDetentOption.allCases) { option in
                    SheetLauncher(option: option)
                }
                InteractiveHint(text: "Large (Stacked)：打开后点「再叠一层 Sheet」，下层 sheet 会缩到后面")
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "5551:18479":
                SheetLauncher(option: .medium)
                InteractiveHint(text: "打开 sheet 后，背后的暗色遮罩由系统绘制")
            case "5719:30145":
                SheetLauncher(option: .large, usesFormSizing: true)
                InteractiveHint(text: "在 iPad 上以表单尺寸居中显示（.presentationSizing(.form)）")
            default:
                PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
