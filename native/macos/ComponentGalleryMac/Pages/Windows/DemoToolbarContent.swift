import SwiftUI

/// 示例窗口工具栏：按钮组、分段控件、按钮、禁用按钮、下拉按钮（Pull Down）、弹出按钮（Pop-Up）。
struct DemoToolbarContent: ToolbarContent {
    @Binding var viewMode: Int
    @Binding var sortOrder: Int

    var body: some ToolbarContent {
        ToolbarItem(placement: .navigation) {
            ControlGroup {
                Button("后退", systemImage: "chevron.left") {}
                Button("前进", systemImage: "chevron.right") {}
            }
        }

        ToolbarItem(placement: .principal) {
            Picker("显示方式", selection: $viewMode) {
                Label("图标", systemImage: "square.grid.2x2").tag(0)
                Label("列表", systemImage: "list.bullet").tag(1)
                Label("分栏", systemImage: "rectangle.split.3x1").tag(2)
            }
            .pickerStyle(.segmented)
        }

        ToolbarItemGroup(placement: .primaryAction) {
            Button("新建", systemImage: "square.and.pencil") {}
            Button("删除", systemImage: "trash") {}
                .disabled(true)

            Menu("操作", systemImage: "ellipsis.circle") {
                Button("复制") {}
                Button("移动到…") {}
                Divider()
                Button("移到废纸篓", role: .destructive) {}
            }

            Picker("排序", selection: $sortOrder) {
                Text("名称").tag(0)
                Text("修改日期").tag(1)
                Text("大小").tag(2)
            }
            .pickerStyle(.menu)
        }
    }
}
