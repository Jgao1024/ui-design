import SwiftUI

struct ListsAndTablesPage: View {
    let page: Page

    var body: some View {
        PageScaffold(page: page) { component in
            switch component.id {
            case "4356:13719": SortOrderIndicatorDemo()
            case "4356:11854": TableRowsDemo()
            case "4356:12135": TableRowsBlankDemo()
            case "0:2566": GroupTitleDemo()
            case "4356:13469": ColumnHeaderDemo()
            case "4356:13263": OutlineViewDemo()
            default: PlaceholderDemo()
            }
        }
    }
}
