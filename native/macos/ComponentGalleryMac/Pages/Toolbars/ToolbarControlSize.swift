import SwiftUI

/// 工具栏族的 Size 轴：Medium → `.regular`，XL → `.extraLarge`。
enum ToolbarControlSize {
    static let all: [(name: String, size: ControlSize)] = [("Medium", .regular), ("XL", .extraLarge)]
}
