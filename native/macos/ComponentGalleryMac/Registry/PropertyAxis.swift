import Foundation

/// 组件族的一个属性轴，例如 `State: Disabled, Clicked, Idle`。
struct PropertyAxis: Decodable, Sendable, Identifiable {
    let name: String
    let values: [String]

    var id: String { name }

    /// 取值只有 Light / Dark 的 Mode 类轴由全局明暗开关控制，区块内不重复展示。
    /// Menu Bar 的 `Color Mode: Over Dark, Over Light` 是壁纸背景，不属于此类。
    var isAppearance: Bool {
        name.hasSuffix("Mode") && values.allSatisfy { $0 == "Light" || $0 == "Dark" }
    }
}
