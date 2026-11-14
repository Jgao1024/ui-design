import SwiftUI

/// 按 slug 选出页面视图。每个 Figma 页面一个 `<PageName>Page`；未登记的 slug 用通用占位页。
struct PageRouter: View {
    let page: Page

    var body: some View {
        switch page.slug {
        // 01-navigation
        case "sidebars": SidebarsPage(page: page)
        case "windows": WindowsPage(page: page)
        // 02-bars
        case "menu-bar-and-dock": MenuBarAndDockPage(page: page)
        case "toolbars": ToolbarsPage(page: page)
        // 03-controls
        case "buttons": ButtonsPage(page: page)
        case "color-wells": ColorWellsPage(page: page)
        case "combo-boxes": ComboBoxesPage(page: page)
        case "disclosure-controls": DisclosureControlsPage(page: page)
        case "group-boxes": GroupBoxesPage(page: page)
        case "image-wells": ImageWellsPage(page: page)
        case "pop-up-and-pull-down-buttons": PopUpAndPullDownButtonsPage(page: page)
        case "progress-indicators": ProgressIndicatorsPage(page: page)
        case "scrollbar": ScrollbarPage(page: page)
        case "segmented-controls": SegmentedControlsPage(page: page)
        case "sliders-and-dials": SlidersAndDialsPage(page: page)
        case "steppers": SteppersPage(page: page)
        case "toggles": TogglesPage(page: page)
        // 04-input
        case "forms": FormsPage(page: page)
        case "search-fields": SearchFieldsPage(page: page)
        case "text-fields": TextFieldsPage(page: page)
        // 05-collections
        case "lists-and-tables": ListsAndTablesPage(page: page)
        // 06-overlays
        case "alerts": AlertsPage(page: page)
        case "dialogs": DialogsPage(page: page)
        case "menus": MenusPage(page: page)
        case "popovers": PopoversPage(page: page)
        case "sheets": SheetsPage(page: page)
        case "tooltips": TooltipsPage(page: page)
        // 07-system
        case "product-bezels": ProductBezelsPage(page: page)
        case "notifications": NotificationsPage(page: page)
        case "pointers": PointersPage(page: page)
        // 08-tokens
        case "colors": ColorsPage(page: page)
        case "materials": MaterialsPage(page: page)
        case "tokens-colors": TokenColorsPage(page: page)
        case "tokens-typography": TokenTypographyPage(page: page)
        case "tokens-effects": TokenEffectsPage(page: page)
        case "tokens-geometry": TokenGeometryPage(page: page)
        default: GenericPage(page: page)
        }
    }
}
