import SwiftUI

/// Size 轴：Large / Medium / Small → `EnvironmentValues.sidebarRowSize`。
enum SidebarSizes {
    static let all: [(name: String, size: SidebarRowSize)] = [("Large", .large), ("Medium", .medium), ("Small", .small)]
}
