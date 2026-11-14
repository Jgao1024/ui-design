import SwiftUI

/// 按页面 slug 选择对应的 `<PageName>Page` 视图。
struct PageRouter: View {
    let page: RegistryPage
    let tokens: TokenData

    var body: some View {
        switch page.slug {
        // 01-navigation
        case "sidebars": SidebarsPage(page: page)
        case "tab-bars": TabBarsPage(page: page)
        case "windows": WindowsPage(page: page)
        // 02-bars
        case "status-bars-and-menu-bars": StatusBarsPage(page: page)
        case "toolbars": ToolbarsPage(page: page)
        // 03-controls
        case "activity-views": ActivityViewsPage(page: page)
        case "buttons": ButtonsPage(page: page)
        case "color-pickers": ColorPickersPage(page: page)
        case "empty-states": EmptyStatesPage(page: page)
        case "page-controls": PageControlsPage(page: page)
        case "pop-up-buttons": PopUpButtonsPage(page: page)
        case "progress-indicators": ProgressIndicatorsPage(page: page)
        case "segmented-controls": SegmentedControlsPage(page: page)
        case "sliders": SlidersPage(page: page)
        case "steppers": SteppersPage(page: page)
        case "toggles": TogglesPage(page: page)
        // 04-input
        case "date-and-time-pickers": DateAndTimePickersPage(page: page)
        case "keyboards": KeyboardsPage(page: page)
        case "text-fields": TextFieldsPage(page: page)
        // 05-collections
        case "lists": ListsPage(page: page)
        // 06-overlays
        case "action-sheets": ActionSheetsPage(page: page)
        case "alerts": AlertsPage(page: page)
        case "contextual-menus": ContextualMenusPage(page: page)
        case "menus": MenusPage(page: page)
        case "popovers": PopoversPage(page: page)
        case "sheets": SheetsPage(page: page)
        // 07-system
        case "product-bezels": ProductBezelsPage(page: page)
        case "system": SystemPage(page: page)
        case "app-icons": AppIconsPage(page: page)
        case "face-id": FaceIDPage(page: page)
        case "notifications": NotificationsPage(page: page)
        case "widgets": WidgetsPage(page: page)
        // 08-tokens（kit 画板页）
        case "colors": ColorsPage(page: page)
        case "materials": MaterialsPage(page: page)
        case "layout-guides": LayoutGuidesPage(page: page)
        // 08-tokens（令牌页）
        case "tokens-colors": ColorsTokenPage(page: page, tokens: tokens)
        case "tokens-typography": TypographyTokenPage(page: page, tokens: tokens)
        case "tokens-effects": EffectsTokenPage(page: page, tokens: tokens)
        case "tokens-geometry": GeometryTokenPage(page: page, tokens: tokens)
        default:
            GenericPage(page: page)
        }
    }
}
