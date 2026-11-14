import SwiftUI

/// Keyboards 页里每个输入框的身份。焦点决定键盘配件栏显示哪一组按钮。
enum KeyboardField: Hashable {
    case search
    case toolbarButton
    case toolbarButtonGroup
    case find
    case url
    case webFormName
    case webFormEmail
    case findReplaceFind
    case findReplaceReplace
    case letters
    case numbers
    case email
    case urlType
    case web
    case numberPad
    case emoji
    case duoLetters
    case duoNumbers
    case iPadLetters

    /// Figma 轴值。
    var caseTitle: String {
        switch self {
        case .search: "Accessory Bar：Search"
        case .toolbarButton: "Type: Button"
        case .toolbarButtonGroup: "Type: Button Group"
        case .find: "Accessory Bar：Find"
        case .url: "Accessory Bar：URL"
        case .webFormName, .webFormEmail: "Accessory Bar：Web Form"
        case .findReplaceFind, .findReplaceReplace: "Accessory Bar：Find and Replace"
        case .letters: "Type: Upper Case / Lower Case"
        case .numbers: "Type: Numeric / Punctuation"
        case .email: "Type: Email"
        case .urlType: "Type: URL"
        case .web: "Type: Web"
        case .numberPad: "Type: Number Pad"
        case .emoji: "Type: Emoji"
        case .duoLetters: "Type: Lower Case / Upper Case"
        case .duoNumbers: "Type: Numeric / Punctuation"
        case .iPadLetters: "Type: Default / Shift"
        }
    }

    var prompt: LocalizedStringResource {
        switch self {
        case .search: "搜索"
        case .toolbarButton, .toolbarButtonGroup: "备忘录正文"
        case .find, .findReplaceFind: "查找"
        case .findReplaceReplace: "替换为"
        case .url, .urlType: "网址"
        case .webFormName: "姓名"
        case .webFormEmail, .email: "电子邮件"
        case .web: "搜索或输入网站名称"
        case .numbers: "数字与标点"
        case .numberPad: "验证码"
        case .letters, .emoji, .duoLetters, .iPadLetters: "输入文字"
        case .duoNumbers: "数字与标点"
        }
    }

    var keyboardType: UIKeyboardType {
        switch self {
        case .url, .urlType: .URL
        case .web: .webSearch
        case .email, .webFormEmail: .emailAddress
        case .numbers, .duoNumbers: .numbersAndPunctuation
        case .numberPad: .numberPad
        default: .default
        }
    }

    var submitLabel: SubmitLabel {
        switch self {
        case .search, .find, .findReplaceFind, .web: .search
        case .url, .urlType: .go
        case .webFormName: .next
        default: .done
        }
    }
}
