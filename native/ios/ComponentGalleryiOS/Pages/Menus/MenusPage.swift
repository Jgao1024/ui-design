import SwiftUI

struct MenusPage: View {
    let page: RegistryPage

    var body: some View {
        PageScaffold(page: page) { family in
            switch family.id {
            case "5855:4981": MenuDemo(kind: .sectionTitle)
            case "5855:5763": MenuDemo(kind: .separator)
            case "5502:6049": MenuDemo(kind: .items)
            case "5848:33925": MenuDemo(kind: .submenus)
            case "5498:16565": MenuDemo(kind: .quickAction)
            case "5908:6487": MenuDemo(kind: .full)
            default: PlaceholderCard(reason: "尚未实现")
            }
        } soloDemo: { solo in
            switch solo.id {
            case "5711:35414": TextSelectionDemo(hint: "双击或长按文字，出现系统选择手柄（Text Selection）")
            case "5713:47505": TextSelectionDemo(hint: "选中文字后出现系统编辑菜单（拷贝、查询、共享等）")
            default: PlaceholderCard(reason: "尚未实现")
            }
        }
    }
}
