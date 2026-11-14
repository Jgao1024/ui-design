// maccap — macOS 采集小工具：窗口信息 / 窗口截屏 / AX 树 / 键鼠驱动
// 用法:
//   maccap pid <bundleId|App名>
//   maccap wins <pid>
//   maccap bounds <pid> <x> <y> <w> <h>
//   maccap shot <pid> <out.png>        // 截该 app 的最上层普通窗口
//   maccap shotwin <wid> <out.png>
//   maccap ax <pid> <maxDepth> <out.json>
//   maccap activate <pid>
//   maccap key <pid> <combo>           // cmd+2 / shift+cmd+n / return
//   maccap click <x> <y>
//   maccap press <pid> <role> <title>  // AX 按下第一个匹配元素
//   maccap menu <pid> <菜单栏标题>      // 打开菜单栏菜单
//   maccap esc

import Foundation
import AppKit
import ApplicationServices

// MARK: - helpers

func axAttr(_ el: AXUIElement, _ name: String) -> AnyObject? {
    var v: AnyObject?
    guard AXUIElementCopyAttributeValue(el, name as CFString, &v) == .success else { return nil }
    return v
}

func axStr(_ el: AXUIElement, _ name: String) -> String? {
    if let s = axAttr(el, name) as? String { return s }
    if let n = axAttr(el, name) as? NSNumber { return n.stringValue }
    return nil
}

func frameOf(_ el: AXUIElement) -> (x: Double, y: Double, w: Double, h: Double)? {
    var posV: AnyObject?, sizeV: AnyObject?
    guard AXUIElementCopyAttributeValue(el, kAXPositionAttribute as CFString, &posV) == .success,
          AXUIElementCopyAttributeValue(el, kAXSizeAttribute as CFString, &sizeV) == .success else { return nil }
    var p = CGPoint.zero, s = CGSize.zero
    guard let pv = posV, CFGetTypeID(pv) == AXValueGetTypeID(), AXValueGetValue(pv as! AXValue, .cgPoint, &p),
          let sv = sizeV, CFGetTypeID(sv) == AXValueGetTypeID(), AXValueGetValue(sv as! AXValue, .cgSize, &s) else { return nil }
    return (Double(p.x), Double(p.y), Double(s.width), Double(s.height))
}

func appFor(_ pid: pid_t) -> AXUIElement { AXUIElementCreateApplication(pid) }

func windows(_ pid: pid_t) -> [AXUIElement] {
    (axAttr(appFor(pid), kAXWindowsAttribute) as? [AXUIElement]) ?? []
}

func resolvePid(_ target: String) -> pid_t? {
    let apps = NSWorkspace.shared.runningApplications
    if let exact = apps.first(where: { $0.bundleIdentifier == target }) { return exact.processIdentifier }
    if let byName = apps.first(where: { $0.localizedName == target }) { return byName.processIdentifier }
    let t = target.replacingOccurrences(of: ".app", with: "")
    if let byBundleFile = apps.first(where: {
        ($0.bundleURL?.deletingPathExtension().lastPathComponent ?? "").caseInsensitiveCompare(t) == .orderedSame
    }) { return byBundleFile.processIdentifier }
    if let loose = apps.first(where: { ($0.localizedName ?? "").localizedCaseInsensitiveContains(target) }) {
        return loose.processIdentifier
    }
    return nil
}

@discardableResult
func setFrames(_ el: AXUIElement, _ x: Double, _ y: Double, _ w: Double, _ h: Double) -> String {
    var p = CGPoint(x: x, y: y); var s = CGSize(width: w, height: h)
    var log: [String] = []
    var yes: CFBoolean = kCFBooleanTrue
    AXUIElementSetAttributeValue(el, kAXMainAttribute as CFString, yes)
    AXUIElementSetAttributeValue(el, kAXFocusedAttribute as CFString, yes)
    if let sv = AXValueCreate(.cgSize, &s) {
        let e = AXUIElementSetAttributeValue(el, kAXSizeAttribute as CFString, sv)
        log.append("size=\(e.rawValue)")
    }
    if let pv = AXValueCreate(.cgPoint, &p) {
        let e = AXUIElementSetAttributeValue(el, kAXPositionAttribute as CFString, pv)
        log.append("pos=\(e.rawValue)")
    }
    usleep(120_000)
    if let pv = AXValueCreate(.cgPoint, &p) { AXUIElementSetAttributeValue(el, kAXPositionAttribute as CFString, pv) }
    return log.joined(separator: ",")
}

func cgWindows(_ pid: pid_t?) -> [[String: Any]] {
    let opts: CGWindowListOption = [.optionOnScreenOnly, .excludeDesktopElements]
    guard let list = CGWindowListCopyWindowInfo(opts, kCGNullWindowID) as? [[String: Any]] else { return [] }
    return list.compactMap { w in
        let owner = w[kCGWindowOwnerPID as String] as? pid_t ?? -1
        if let p = pid, owner != p { return nil }
        let b = (w[kCGWindowBounds as String] as? NSDictionary).flatMap { CGRect(dictionaryRepresentation: $0) } ?? .zero
        return [
            "wid": w[kCGWindowNumber as String] as? Int ?? 0,
            "pid": Int(owner),
            "layer": w[kCGWindowLayer as String] as? Int ?? 0,
            "owner": w[kCGWindowOwnerName as String] as? String ?? "",
            "name": w[kCGWindowName as String] as? String ?? "",
            "x": Double(b.origin.x), "y": Double(b.origin.y),
            "w": Double(b.size.width), "h": Double(b.size.height)
        ]
    }
}

func jsonPrint(_ obj: Any) {
    if let d = try? JSONSerialization.data(withJSONObject: obj, options: [.sortedKeys, .prettyPrinted]),
       let s = String(data: d, encoding: .utf8) { print(s) }
}

// MARK: - AX tree dump

func dumpTree(_ el: AXUIElement, depth: Int, maxDepth: Int) -> [String: Any] {
    var node: [String: Any] = [:]
    node["role"] = axStr(el, kAXRoleAttribute) ?? "?"
    if let v = axStr(el, kAXSubroleAttribute), !v.isEmpty { node["subrole"] = v }
    for (k, attr) in [("title", kAXTitleAttribute), ("desc", kAXDescriptionAttribute),
                      ("help", kAXHelpAttribute), ("value", kAXValueAttribute),
                      ("identifier", kAXIdentifierAttribute)] {
        if let v = axStr(el, attr), !v.isEmpty { node[k] = String(v.prefix(120)) }
    }
    if let f = frameOf(el) {
        node["frame"] = [f.x, f.y, f.w, f.h].map { ($0 * 10).rounded() / 10 }
    }
    if let enabled = axAttr(el, kAXEnabledAttribute) as? Bool, !enabled { node["disabled"] = true }
    if let sel = axAttr(el, kAXSelectedAttribute) as? Bool, sel { node["selected"] = true }
    if depth < maxDepth, let kids = axAttr(el, kAXChildrenAttribute) as? [AXUIElement], !kids.isEmpty {
        node["children"] = kids.map { dumpTree($0, depth: depth + 1, maxDepth: maxDepth) }
    }
    return node
}

func findByTitle(_ el: AXUIElement, role: String?, title: String, depth: Int = 0) -> AXUIElement? {
    if depth > 14 { return nil }
    let r = axStr(el, kAXRoleAttribute) ?? ""
    let t = (axStr(el, kAXTitleAttribute) ?? "") + "|" + (axStr(el, kAXDescriptionAttribute) ?? "")
    let roleOK = role == nil || r == role!
    if roleOK && t.localizedCaseInsensitiveContains(title) { return el }
    if let kids = axAttr(el, kAXChildrenAttribute) as? [AXUIElement] {
        for k in kids { if let hit = findByTitle(k, role: role, title: title, depth: depth + 1) { return hit } }
    }
    return nil
}

// MARK: - input

func clickAt(_ x: Double, _ y: Double) {
    let p = CGPoint(x: x, y: y)
    let src = CGEventSource(stateID: .hidSystemState)
    CGEvent(mouseEventSource: src, mouseType: .mouseMoved, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
    usleep(40_000)
    CGEvent(mouseEventSource: src, mouseType: .leftMouseDown, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
    usleep(30_000)
    CGEvent(mouseEventSource: src, mouseType: .leftMouseUp, mouseCursorPosition: p, mouseButton: .left)?.post(tap: .cghidEventTap)
}

let keyCodes: [String: CGKeyCode] = [
    "return": 36, "enter": 36, "tab": 48, "space": 49, "esc": 53, "escape": 53, "delete": 51,
    "left": 123, "right": 124, "down": 125, "up": 126, "home": 115, "end": 119,
    "f1": 122, "f2": 120, "f3": 99, "f4": 118, "f5": 96, "f6": 97,
    ",": 43, ".": 47, "/": 44, ";": 41, "-": 27, "=": 24, "[": 33, "]": 30
]

func sendKey(_ combo: String) {
    let parts = combo.lowercased().split(separator: "+").map(String.init)
    var flags: CGEventFlags = []
    var keyName: String?
    for p in parts {
        switch p {
        case "cmd", "command", "meta": flags.insert(.maskCommand)
        case "shift": flags.insert(.maskShift)
        case "opt", "option", "alt": flags.insert(.maskAlternate)
        case "ctrl", "control": flags.insert(.maskControl)
        default: keyName = p
        }
    }
    guard let kn = keyName else { return }
    let code: CGKeyCode
    if let c = keyCodes[kn] { code = c }
    else if kn.count == 1, let scalar = kn.unicodeScalars.first {
        // 用虚拟键码映射，避免 CGEvent 字符注入对某些 app 无效
        let map: [Character: CGKeyCode] = ["a":0,"s":1,"d":2,"f":3,"h":4,"g":5,"z":6,"x":7,"c":8,"v":9,"b":11,"q":12,"w":13,"e":14,"r":15,"y":16,"t":17,"1":18,"2":19,"3":20,"4":21,"6":22,"5":23,"=":24,"9":25,"7":26,"-":27,"8":28,"0":29,"]":30,"o":31,"u":32,"[":33,"i":34,"p":35,"l":37,"j":38,"'":39,"k":40,";":41,"\\":42,",":43,"/":44,"n":45,"m":46,".":47]
        guard let m = map[Character(scalar)] else { return }
        code = m
    } else { return }
    let src = CGEventSource(stateID: .hidSystemState)
    if let down = CGEvent(keyboardEventSource: src, virtualKey: code, keyDown: true) {
        down.flags = flags; down.post(tap: .cghidEventTap)
    }
    usleep(25_000)
    if let up = CGEvent(keyboardEventSource: src, virtualKey: code, keyDown: false) {
        up.flags = flags; up.post(tap: .cghidEventTap)
    }
}

// MARK: - main

let args = CommandLine.arguments
guard args.count >= 2 else { FileHandle.standardError.write("usage: maccap <cmd> ...\n".data(using: .utf8)!); exit(1) }
let cmd = args[1]

switch cmd {
case "pid":
    guard args.count >= 3, let p = resolvePid(args[2]) else { exit(2) }
    print(p)

case "wins":
    guard let p = resolvePid(args[2]) else { exit(2) }
    jsonPrint(cgWindows(p))

case "bounds":
    guard let p = resolvePid(args[2]), args.count >= 7,
          let x = Double(args[3]), let y = Double(args[4]), let w = Double(args[5]), let h = Double(args[6]) else { exit(2) }
    let live = cgWindows(p).filter { ($0["layer"] as? Int) == 0 }
    func isLive(_ f: (x: Double, y: Double, w: Double, h: Double)) -> Bool {
        live.contains { abs(($0["w"] as! Double) - f.w) < 3 && abs(($0["h"] as! Double) - f.h) < 3 }
    }
    let ws = windows(p).filter { if let f = frameOf($0) { return isLive(f) } else { return false } }
    // 优先当前聚焦窗口，绝不误改别的桌面/别的窗口
    let win = ws.first(where: { axAttr($0, kAXFocusedAttribute) as? Bool == true })
        ?? ws.first(where: { axAttr($0, kAXMainAttribute) as? Bool == true })
        ?? ws.max(by: { (frameOf($0)?.w ?? 0) * (frameOf($0)?.h ?? 0) < (frameOf($1)?.w ?? 0) * (frameOf($1)?.h ?? 0) })
    guard let win = win else { exit(3) }
    let diag = setFrames(win, x, y, w, h)
    if let f = frameOf(win) { print("{\"x\":\(f.x),\"y\":\(f.y),\"w\":\(f.w),\"h\":\(f.h),\"diag\":\"\(diag)\"}") }

case "shotf", "shotlayer":
    // shotf: 截当前最前（AXFocused）窗口；shotlayer: 截该 app 的浮层窗口（菜单/弹窗）
    guard args.count >= 4, let pid = resolvePid(args[2]) else { exit(2) }
    let out = (args[3] as NSString).expandingTildeInPath
    let cg = cgWindows(pid)
    var target: [String: Any]?
    if cmd == "shotf" {
        var focusFrame: (x: Double, y: Double, w: Double, h: Double)?
        for w in windows(pid) {
            if (axAttr(w, kAXFocusedAttribute) as? Bool == true) || (axAttr(w, kAXMainAttribute) as? Bool == true) {
                focusFrame = frameOf(w); break
            }
        }
        if focusFrame == nil { focusFrame = windows(pid).first.flatMap { frameOf($0) } }
        if let f = focusFrame {
            target = cg.filter { ($0["layer"] as? Int ?? 0) >= 0 }
                .min { a, b in
                    let da = abs((a["x"] as! Double) - f.x) + abs((a["y"] as! Double) - f.y)
                             + abs((a["w"] as! Double) - f.w) + abs((a["h"] as! Double) - f.h)
                    let db = abs((b["x"] as! Double) - f.x) + abs((b["y"] as! Double) - f.y)
                             + abs((b["w"] as! Double) - f.w) + abs((b["h"] as! Double) - f.h)
                    return da < db
                }
        }
    } else {
        let minLayer = args.count > 4 ? (Int(args[4]) ?? 1) : 1
        target = cg.filter { ($0["layer"] as? Int ?? 0) >= minLayer }
            .sorted { ($0["w"] as! Double) * ($0["h"] as! Double) > ($1["w"] as! Double) * ($1["h"] as! Double) }
            .first
    }
    guard let t = target, let wid = t["wid"] as? Int else { exit(3) }
    let proc = Process()
    proc.executableURL = URL(fileURLWithPath: "/usr/sbin/screencapture")
    proc.arguments = ["-x", "-o", "-l", "\(wid)", out]
    try? proc.run(); proc.waitUntilExit()
    if proc.terminationStatus != 0 { exit(4) }
    let bx = (t["x"] as? Double ?? 0), by = (t["y"] as? Double ?? 0)
    let bw = (t["w"] as? Double ?? 0), bh = (t["h"] as? Double ?? 0)
    print("{\"wid\":\(wid),\"x\":\(bx),\"y\":\(by),\"w\":\(bw),\"h\":\(bh)}")

case "shot", "shotwin":
    guard args.count >= 4 else { exit(2) }
    let out = (args[3] as NSString).expandingTildeInPath
    var wid: Int
    if cmd == "shotwin" {
        wid = Int(args[2]) ?? 0
    } else {
        guard let p = resolvePid(args[2]) else { exit(2) }
        let cands = cgWindows(p).filter { $0["layer"] as? Int == 0 && ($0["w"] as? Double ?? 0) > 200 }
            .sorted { ($0["w"] as! Double) * ($0["h"] as! Double) > ($1["w"] as! Double) * ($1["h"] as! Double) }
        guard let best = cands.first, let id = best["wid"] as? Int, id > 0 else { exit(3) }
        wid = id
    }
    let t = Process()
    t.executableURL = URL(fileURLWithPath: "/usr/sbin/screencapture")
    t.arguments = ["-x", "-o", "-l", "\(wid)", out]
    try? t.run(); t.waitUntilExit()
    if t.terminationStatus != 0 { exit(4) }
    print(out)

case "ax":
    guard let p = resolvePid(args[2]) else { exit(2) }
    let depth = args.count > 3 ? Int(args[3]) ?? 8 : 8
    let tree = dumpTree(appFor(p), depth: 0, maxDepth: depth)
    let payload: [String: Any] = ["pid": Int(p), "tree": tree]
    if args.count > 4 {
        let d = try! JSONSerialization.data(withJSONObject: payload, options: [.sortedKeys])
        try! d.write(to: URL(fileURLWithPath: (args[4] as NSString).expandingTildeInPath))
    } else { jsonPrint(payload) }

case "activate":
    guard let p = resolvePid(args[2]) else { exit(2) }
    NSRunningApplication(processIdentifier: p)?.activate(options: [.activateAllWindows])

case "keyglobal":
    sendKey(args[2])
    print("ok")

case "key":
    guard let p = resolvePid(args[2]) else { exit(2) }
    NSRunningApplication(processIdentifier: p)?.activate(options: [.activateAllWindows])
    usleep(80_000)
    sendKey(args[3])

case "click":
    guard args.count >= 4, let x = Double(args[2]), let y = Double(args[3]) else { exit(2) }
    clickAt(x, y)

case "press":
    guard let p = resolvePid(args[2]) else { exit(2) }
    let role = args[3] == "-" ? nil : args[3]
    guard let el = findByTitle(appFor(p), role: role, title: args[4]) else { exit(3) }
    AXUIElementPerformAction(el, kAXPressAction as CFString)

case "menu":
    guard let p = resolvePid(args[2]) else { exit(2) }
    NSRunningApplication(processIdentifier: p)?.activate(options: [.activateAllWindows])
    usleep(250_000)
    guard let barAny = axAttr(appFor(p), "AXMenuBar") else { exit(3) }
    let mb = barAny as! AXUIElement
    guard let items = axAttr(mb, kAXChildrenAttribute) as? [AXUIElement] else { exit(3) }
    for it in items {
        let t = (axStr(it, kAXTitleAttribute) ?? "")
        if t == args[3] { AXUIElementPerformAction(it, kAXPressAction as CFString); print("ok"); exit(0) }
    }
    exit(3)

case "type":
    guard let pid = resolvePid(args[2]) else { exit(2) }
    NSRunningApplication(processIdentifier: pid)?.activate(options: [.activateAllWindows])
    usleep(120_000)
    let src = CGEventSource(stateID: .hidSystemState)
    for ch in args[3] {
        var utf16 = Array(String(ch).utf16)
        if let d = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true) {
            d.keyboardSetUnicodeString(stringLength: utf16.count, unicodeString: &utf16)
            d.post(tap: .cghidEventTap)
        }
        usleep(12_000)
        if let u = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) {
            u.keyboardSetUnicodeString(stringLength: utf16.count, unicodeString: &utf16)
            u.post(tap: .cghidEventTap)
        }
        usleep(12_000)
    }

case "pressfirst":
    // 按角色找到第一个可见元素并按下（用于列表选行、侧栏切项等通用动作）
    guard let pid = resolvePid(args[2]) else { exit(2) }
    let roles = Set(args[3].split(separator: ",").map(String.init))
    let skipTitles = args.count > 4 ? Set(args[4].split(separator: ",").map(String.init)) : Set<String>()
    var best: AXUIElement?
    var bestArea: Double = -1
    func scan(_ el: AXUIElement, _ d: Int) {
        if d > 14 { return }
        let r = axStr(el, kAXRoleAttribute) ?? ""
        if roles.contains(r), let f = frameOf(el), f.w > 20, f.h > 8 {
            let t = axStr(el, kAXTitleAttribute) ?? ""
            let desc = axStr(el, kAXDescriptionAttribute) ?? ""
            let bad = skipTitles.contains(where: { t.contains($0) || desc.contains($0) })
            if !bad {
                let area = f.w * f.h
                if best == nil || area < bestArea { best = el; bestArea = area }
            }
        }
        if let kids = axAttr(el, kAXChildrenAttribute) as? [AXUIElement] {
            for k in kids { scan(k, d + 1) }
        }
    }
    scan(appFor(pid), 0)
    guard let el = best else { exit(3) }
    let e = AXUIElementPerformAction(el, kAXPressAction as CFString)
    print("press=\(e.rawValue) role=\(axStr(el, kAXRoleAttribute) ?? "") t=\(axStr(el, kAXTitleAttribute) ?? "")")

case "resize":
    // 用真实拖拽缩放右下角，绕过部分应用对 AXSize 的限制
    guard let pid = resolvePid(args[2]), args.count >= 5,
          let tw = Double(args[3]), let th = Double(args[4]), let win = windows(pid).first,
          let f = frameOf(win) else { exit(2) }
    NSRunningApplication(processIdentifier: pid)?.activate(options: [.activateAllWindows])
    usleep(200_000)
    let sx = f.x + f.w - 2, sy = f.y + f.h - 2
    let ex = f.x + tw - 2, ey = f.y + th - 2
    let src = CGEventSource(stateID: .hidSystemState)
    func post(_ t: CGEventType, _ pt: CGPoint) {
        CGEvent(mouseEventSource: src, mouseType: t, mouseCursorPosition: pt, mouseButton: .left)?.post(tap: .cghidEventTap)
    }
    post(.mouseMoved, CGPoint(x: sx, y: sy)); usleep(120_000)
    post(.leftMouseDown, CGPoint(x: sx, y: sy)); usleep(120_000)
    for i in 1...12 {
        let r = Double(i) / 12.0
        post(.leftMouseDragged, CGPoint(x: sx + (ex - sx) * r, y: sy + (ey - sy) * r))
        usleep(30_000)
    }
    post(.leftMouseUp, CGPoint(x: ex, y: ey)); usleep(150_000)
    if let f2 = frameOf(windows(pid).first ?? win) { print("{\"x\":\(f2.x),\"y\":\(f2.y),\"w\":\(f2.w),\"h\":\(f2.h)}") }

case "presssub":
    guard let pid = resolvePid(args[2]) else { exit(2) }
    func findSub(_ el: AXUIElement, _ sub: String, _ d: Int) -> AXUIElement? {
        if d > 12 { return nil }
        if (axStr(el, kAXSubroleAttribute) ?? "") == sub { return el }
        if let kids = axAttr(el, kAXChildrenAttribute) as? [AXUIElement] {
            for k in kids { if let h = findSub(k, sub, d + 1) { return h } }
        }
        return nil
    }
    guard let el = findSub(appFor(pid), args[3], 0) else { exit(3) }
    let e = AXUIElementPerformAction(el, kAXPressAction as CFString)
    print("press=\(e.rawValue)")

case "esc":
    sendKey("esc")

default:
    FileHandle.standardError.write("unknown cmd\n".data(using: .utf8)!); exit(1)
}
