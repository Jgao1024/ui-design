import Foundation

/// 全局设备筛选。族名或独立组件名含设备词的按筛选显示，不含设备词的始终显示。
enum DeviceFilter: String, CaseIterable, Identifiable {
    case all
    case iPhone
    case iPad
    case iPhoneDuo

    var id: Self { self }

    var title: LocalizedStringResource {
        switch self {
        case .all: "全部"
        case .iPhone: "iPhone"
        case .iPad: "iPad"
        case .iPhoneDuo: "iPhone Duo"
        }
    }

    /// 先判断 iPhone Duo，再判断 iPad，最后 iPhone。
    static func device(of name: String) -> DeviceFilter? {
        if name.contains("iPhone Duo") {
            .iPhoneDuo
        } else if name.contains("iPad") {
            .iPad
        } else if name.contains("iPhone") {
            .iPhone
        } else {
            nil
        }
    }

    func allows(_ name: String) -> Bool {
        guard self != .all, let device = Self.device(of: name) else { return true }
        return device == self
    }
}
