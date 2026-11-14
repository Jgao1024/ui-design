import ApplicationServices
import AppKit

func attr(_ el: AXUIElement, _ name: String) -> AnyObject? {
    var v: AnyObject?
    return AXUIElementCopyAttributeValue(el, name as CFString, &v) == .success ? v : nil
}
func pt(_ v: AnyObject?) -> String {
    guard let v = v, CFGetTypeID(v) == AXValueGetTypeID() else { return "" }
    let ax = v as! AXValue
    if AXValueGetType(ax) == .cgPoint { var p = CGPoint.zero; AXValueGetValue(ax, .cgPoint, &p); return "@\(Int(p.x)),\(Int(p.y))" }
    if AXValueGetType(ax) == .cgSize { var s = CGSize.zero; AXValueGetValue(ax, .cgSize, &s); return "\(Int(s.width))x\(Int(s.height))" }
    return ""
}
func walk(_ el: AXUIElement, _ depth: Int, _ maxD: Int) {
    if depth > maxD { return }
    let role = (attr(el, kAXRoleAttribute) as? String) ?? "?"
    var sub = (attr(el, kAXSubroleAttribute) as? String) ?? ""
    let title = (attr(el, kAXTitleAttribute) as? String) ?? ""
    let desc = (attr(el, kAXDescriptionAttribute) as? String) ?? ""
    let val = (attr(el, kAXValueAttribute) as? String) ?? ""
    let help = (attr(el, kAXHelpAttribute) as? String) ?? ""
    print(String(repeating: "  ", count: depth) + "\(role)\(sub.isEmpty ? "" : "/\(sub)") pos=\(pt(attr(el, kAXPositionAttribute))) size=\(pt(attr(el, kAXSizeAttribute))) t=\(title.prefix(24)) d=\(desc.prefix(24)) v=\(val.prefix(20)) h=\(help.prefix(18))")
    if let kids = attr(el, kAXChildrenAttribute) as? [AXUIElement] {
        for k in kids.prefix(40) { walk(k, depth + 1, maxD) }
    }
}

let name = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "Calculator"
guard let app = NSRunningApplication.runningApplications(withBundleIdentifier: CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "com.apple.calculator").first else {
    FileHandle.standardError.write("app not running\n".data(using: .utf8)!); exit(2)
}
print("app:", app.localizedName ?? "?")
walk(AXUIElementCreateApplication(app.processIdentifier), 0, Int(CommandLine.arguments.count > 3 ? CommandLine.arguments[3] : "6") ?? 6)
