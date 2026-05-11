import AppKit
import ApplicationServices
import Foundation

// MARK: - JSON Helpers

func jsonString(_ value: Any) -> String {
    if let data = try? JSONSerialization.data(withJSONObject: value, options: [.sortedKeys]),
       let str = String(data: data, encoding: .utf8) {
        return str
    }
    return "{}"
}

func respond(_ dict: [String: Any]) {
    print(jsonString(dict))
}

func respondError(_ message: String) -> Never {
    respond(["error": message])
    exit(1)
}

// MARK: - App Helpers

func findProcess(bundleId: String) -> NSRunningApplication? {
    NSWorkspace.shared.runningApplications.first { $0.bundleIdentifier == bundleId }
}

func findProcessByName(_ name: String) -> NSRunningApplication? {
    NSWorkspace.shared.runningApplications.first {
        $0.localizedName?.lowercased() == name.lowercased()
    }
}

func resolveApp(_ identifier: String) -> NSRunningApplication? {
    findProcess(bundleId: identifier) ?? findProcessByName(identifier)
}

func axApp(for process: NSRunningApplication) -> AXUIElement {
    AXUIElementCreateApplication(process.processIdentifier)
}

// MARK: - AX Helpers

func axValue(_ element: AXUIElement, _ attribute: String) -> AnyObject? {
    var value: AnyObject?
    AXUIElementCopyAttributeValue(element, attribute as CFString, &value)
    return value
}

func axStringValue(_ element: AXUIElement, _ attribute: String) -> String? {
    axValue(element, attribute) as? String
}

func axChildren(_ element: AXUIElement) -> [AXUIElement] {
    (axValue(element, kAXChildrenAttribute) as? [AXUIElement]) ?? []
}

func axPosition(_ element: AXUIElement) -> CGPoint? {
    var value: AnyObject?
    AXUIElementCopyAttributeValue(element, kAXPositionAttribute as CFString, &value)
    guard let val = value else { return nil }
    var point = CGPoint.zero
    AXValueGetValue(val as! AXValue, .cgPoint, &point)
    return point
}

func axSize(_ element: AXUIElement) -> CGSize? {
    var value: AnyObject?
    AXUIElementCopyAttributeValue(element, kAXSizeAttribute as CFString, &value)
    guard let val = value else { return nil }
    var size = CGSize.zero
    AXValueGetValue(val as! AXValue, .cgSize, &size)
    return size
}

func axBounds(_ element: AXUIElement) -> [String: CGFloat]? {
    guard let pos = axPosition(element), let size = axSize(element) else { return nil }
    return ["x": pos.x, "y": pos.y, "width": size.width, "height": size.height]
}

// MARK: - Tree Extraction

func elementToDict(_ element: AXUIElement, depth: Int, maxDepth: Int) -> [String: Any] {
    var dict: [String: Any] = [:]

    if let role = axStringValue(element, kAXRoleAttribute) { dict["role"] = role }
    if let title = axStringValue(element, kAXTitleAttribute), !title.isEmpty { dict["title"] = title }
    if let desc = axStringValue(element, kAXDescriptionAttribute), !desc.isEmpty { dict["desc"] = desc }
    if let identifier = axStringValue(element, kAXIdentifierAttribute), !identifier.isEmpty { dict["id"] = identifier }
    if let value = axStringValue(element, kAXValueAttribute), !value.isEmpty { dict["value"] = value }
    if let roleDesc = axStringValue(element, kAXRoleDescriptionAttribute), !roleDesc.isEmpty { dict["roleDesc"] = roleDesc }

    // Include subrole for disambiguation
    if let subrole = axStringValue(element, kAXSubroleAttribute), !subrole.isEmpty { dict["subrole"] = subrole }

    // State attributes
    var focused: AnyObject?
    if AXUIElementCopyAttributeValue(element, kAXFocusedAttribute as CFString, &focused) == .success {
        if let f = focused as? Bool, f { dict["focused"] = true }
    }
    var enabled: AnyObject?
    if AXUIElementCopyAttributeValue(element, kAXEnabledAttribute as CFString, &enabled) == .success {
        if let e = enabled as? Bool { dict["enabled"] = e }
    }
    var selected: AnyObject?
    if AXUIElementCopyAttributeValue(element, kAXSelectedAttribute as CFString, &selected) == .success {
        if let s = selected as? Bool, s { dict["selected"] = true }
    }

    if depth < maxDepth {
        let children = axChildren(element)
        if !children.isEmpty {
            dict["children"] = children.prefix(50).map { elementToDict($0, depth: depth + 1, maxDepth: maxDepth) }
        }
    }

    return dict
}

// MARK: - Element Finding

struct PathSegment {
    let role: String?
    let title: String?
    let desc: String?
    let identifier: String?
    let index: Int?
}

func matchesSegment(_ element: AXUIElement, _ seg: PathSegment) -> Bool {
    if let role = seg.role, axStringValue(element, kAXRoleAttribute) != role { return false }
    if let title = seg.title {
        let actual = axStringValue(element, kAXTitleAttribute) ?? ""
        if !actual.lowercased().contains(title.lowercased()) { return false }
    }
    if let desc = seg.desc {
        let actual = axStringValue(element, kAXDescriptionAttribute) ?? ""
        if !actual.lowercased().contains(desc.lowercased()) { return false }
    }
    if let id = seg.identifier {
        let actual = axStringValue(element, kAXIdentifierAttribute) ?? ""
        if actual != id { return false }
    }
    return true
}

func findElements(_ root: AXUIElement, role: String?, title: String?, desc: String?, identifier: String?, maxResults: Int, depth: Int = 0, maxDepth: Int = 25) -> [[String: Any]] {
    var results: [[String: Any]] = []
    if results.count >= maxResults { return results }

    let seg = PathSegment(role: role, title: title, desc: desc, identifier: identifier, index: nil)
    if depth > 0 && matchesSegment(root, seg) {
        var info = elementToDict(root, depth: 0, maxDepth: 0)
        if let bounds = axBounds(root) { info["bounds"] = bounds }
        // Build path for clicking
        info["_depth"] = depth
        results.append(info)
    }

    if depth < maxDepth && results.count < maxResults {
        for child in axChildren(root) {
            let found = findElements(child, role: role, title: title, desc: desc, identifier: identifier, maxResults: maxResults - results.count, depth: depth + 1, maxDepth: maxDepth)
            results.append(contentsOf: found)
            if results.count >= maxResults { break }
        }
    }

    return results
}

// MARK: - Element Resolution by Path

func resolveElement(_ root: AXUIElement, path: [[String: Any]]) -> AXUIElement? {
    var current = root
    for segment in path {
        let role = segment["role"] as? String
        let title = segment["title"] as? String
        let identifier = segment["id"] as? String
        let index = segment["index"] as? Int ?? 0

        let children = axChildren(current)
        var matchCount = 0
        var found = false
        for child in children {
            let childRole = axStringValue(child, kAXRoleAttribute)
            let childTitle = axStringValue(child, kAXTitleAttribute)
            let childId = axStringValue(child, kAXIdentifierAttribute)

            var matches = true
            if let role = role, childRole != role { matches = false }
            if let title = title, childTitle != title { matches = false }
            if let id = identifier, childId != id { matches = false }

            if matches {
                if matchCount == index {
                    current = child
                    found = true
                    break
                }
                matchCount += 1
            }
        }
        if !found { return nil }
    }
    return current
}

// MARK: - Deep Find (finds element anywhere in tree by matching criteria)

func deepFind(_ root: AXUIElement, role: String?, title: String?, desc: String? = nil, identifier: String?, index: Int = 0, depth: Int = 0, matchCount: inout Int) -> AXUIElement? {
    if depth > 0 {
        var matches = true
        if let role = role, axStringValue(root, kAXRoleAttribute) != role { matches = false }
        if let title = title {
            let actual = axStringValue(root, kAXTitleAttribute) ?? ""
            if !actual.lowercased().contains(title.lowercased()) { matches = false }
        }
        if let desc = desc {
            let actual = axStringValue(root, kAXDescriptionAttribute) ?? ""
            if !actual.lowercased().contains(desc.lowercased()) { matches = false }
        }
        if let id = identifier, axStringValue(root, kAXIdentifierAttribute) != id { matches = false }
        if matches {
            if matchCount == index { return root }
            matchCount += 1
        }
    }

    if depth < 30 {
        for child in axChildren(root) {
            if let found = deepFind(child, role: role, title: title, desc: desc, identifier: identifier, index: index, depth: depth + 1, matchCount: &matchCount) {
                return found
            }
        }
    }
    return nil
}

// Convenience wrapper
func deepFind(_ root: AXUIElement, role: String?, title: String?, desc: String? = nil, identifier: String?, index: Int = 0) -> AXUIElement? {
    var count = 0
    return deepFind(root, role: role, title: title, desc: desc, identifier: identifier, index: index, depth: 0, matchCount: &count)
}

// MARK: - Actions

func performClick(_ element: AXUIElement) -> Bool {
    AXUIElementPerformAction(element, kAXPressAction as CFString) == .success
}

func performDoubleClick(_ element: AXUIElement) -> Bool {
    guard let pos = axPosition(element), let size = axSize(element) else { return false }
    let centerX = pos.x + size.width / 2
    let centerY = pos.y + size.height / 2

    let mouseDown = CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: CGPoint(x: centerX, y: centerY), mouseButton: .left)
    let mouseUp = CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: CGPoint(x: centerX, y: centerY), mouseButton: .left)
    mouseDown?.setIntegerValueField(.mouseEventClickState, value: 2)
    mouseUp?.setIntegerValueField(.mouseEventClickState, value: 2)
    mouseDown?.post(tap: .cghidEventTap)
    mouseUp?.post(tap: .cghidEventTap)
    return true
}

func performRightClick(_ element: AXUIElement) -> Bool {
    guard let pos = axPosition(element), let size = axSize(element) else { return false }
    let centerX = pos.x + size.width / 2
    let centerY = pos.y + size.height / 2

    let mouseDown = CGEvent(mouseEventSource: nil, mouseType: .rightMouseDown, mouseCursorPosition: CGPoint(x: centerX, y: centerY), mouseButton: .right)
    let mouseUp = CGEvent(mouseEventSource: nil, mouseType: .rightMouseUp, mouseCursorPosition: CGPoint(x: centerX, y: centerY), mouseButton: .right)
    mouseDown?.post(tap: .cghidEventTap)
    mouseUp?.post(tap: .cghidEventTap)
    return true
}

func typeText(_ text: String) {
    for char in text {
        let str = String(char)
        let src = CGEventSource(stateID: .hidSystemState)
        if let event = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: true) {
            event.keyboardSetUnicodeString(string: str)
            event.post(tap: .cghidEventTap)
        }
        if let event = CGEvent(keyboardEventSource: src, virtualKey: 0, keyDown: false) {
            event.keyboardSetUnicodeString(string: str)
            event.post(tap: .cghidEventTap)
        }
        usleep(8000) // 8ms between keystrokes
    }
}

extension CGEvent {
    func keyboardSetUnicodeString(string: String) {
        let chars = Array(string.utf16)
        self.keyboardSetUnicodeString(stringLength: chars.count, unicodeString: chars)
    }
}

// Key code mapping
let keyCodeMap: [String: CGKeyCode] = [
    "return": 36, "enter": 36, "tab": 48, "space": 49, "delete": 51, "backspace": 51,
    "escape": 53, "esc": 53, "command": 55, "cmd": 55, "shift": 56, "capslock": 57,
    "option": 58, "alt": 58, "control": 59, "ctrl": 59,
    "left": 123, "right": 124, "down": 125, "up": 126,
    "f1": 122, "f2": 120, "f3": 99, "f4": 118, "f5": 96, "f6": 97,
    "f7": 98, "f8": 100, "f9": 101, "f10": 109, "f11": 103, "f12": 111,
    "a": 0, "b": 11, "c": 8, "d": 2, "e": 14, "f": 3, "g": 5, "h": 4,
    "i": 34, "j": 38, "k": 40, "l": 37, "m": 46, "n": 45, "o": 31, "p": 35,
    "q": 12, "r": 15, "s": 1, "t": 17, "u": 32, "v": 9, "w": 13, "x": 7,
    "y": 16, "z": 6,
    "0": 29, "1": 18, "2": 19, "3": 20, "4": 21, "5": 23, "6": 22, "7": 26,
    "8": 28, "9": 25,
    "-": 27, "=": 24, "[": 33, "]": 30, "\\": 42, ";": 41, "'": 39,
    ",": 43, ".": 47, "/": 44, "`": 50,
]

func sendShortcut(_ keys: String) {
    let parts = keys.lowercased().split(separator: "+").map { $0.trimmingCharacters(in: .whitespaces) }

    var flags: CGEventFlags = []
    var keyCode: CGKeyCode = 0

    for part in parts {
        switch part {
        case "cmd", "command": flags.insert(.maskCommand)
        case "shift": flags.insert(.maskShift)
        case "alt", "option": flags.insert(.maskAlternate)
        case "ctrl", "control": flags.insert(.maskControl)
        default:
            if let code = keyCodeMap[part] { keyCode = code }
        }
    }

    let src = CGEventSource(stateID: .hidSystemState)
    if let keyDown = CGEvent(keyboardEventSource: src, virtualKey: keyCode, keyDown: true) {
        keyDown.flags = flags
        keyDown.post(tap: .cghidEventTap)
    }
    usleep(50000)
    if let keyUp = CGEvent(keyboardEventSource: src, virtualKey: keyCode, keyDown: false) {
        keyUp.flags = flags
        keyUp.post(tap: .cghidEventTap)
    }
}

// MARK: - Screenshot

func takeScreenshot(bundleId: String?, format: String = "jpg") -> String? {
    let tmpFile = "/tmp/cccontrol-screenshot-\(ProcessInfo.processInfo.processIdentifier).\(format)"

    var args = ["-x", "-t", format]
    if let bundleId = bundleId, let app = findProcess(bundleId: bundleId) {
        // Capture specific window by finding its window ID
        let windowList = CGWindowListCopyWindowInfo([.optionOnScreenOnly, .excludeDesktopElements], kCGNullWindowID) as? [[String: Any]] ?? []
        let pid = app.processIdentifier
        if let window = windowList.first(where: { ($0[kCGWindowOwnerPID as String] as? Int32) == pid }) {
            if let windowId = window[kCGWindowNumber as String] as? Int {
                args = ["-x", "-t", format, "-l", String(windowId)]
            }
        }
    }

    args.append(tmpFile)

    let task = Process()
    task.executableURL = URL(fileURLWithPath: "/usr/sbin/screencapture")
    task.arguments = args
    try? task.run()
    task.waitUntilExit()

    guard let data = FileManager.default.contents(atPath: tmpFile) else { return nil }
    try? FileManager.default.removeItem(atPath: tmpFile)
    return data.base64EncodedString()
}

// MARK: - Menu Navigation

func navigateMenu(_ app: AXUIElement, menuPath: [String]) -> Bool {
    guard let menuBarVal = axValue(app, kAXMenuBarAttribute) else { return false }
    let menuBar = menuBarVal as! AXUIElement

    var current: AXUIElement = menuBar
    for (i, item) in menuPath.enumerated() {
        let children = axChildren(current)
        var found = false
        for child in children {
            let title = axStringValue(child, kAXTitleAttribute) ?? ""
            if title.lowercased().contains(item.lowercased()) {
                if i == menuPath.count - 1 {
                    // Last item - click it
                    return performClick(child)
                } else {
                    // Intermediate - open submenu
                    let _ = performClick(child)
                    usleep(100000) // 100ms for menu to open
                    let subMenus = axChildren(child)
                    if let subMenu = subMenus.first {
                        current = subMenu
                        found = true
                        break
                    }
                }
            }
        }
        if !found && current === menuBar { return false }
    }
    return false
}

// MARK: - Wait For

func waitForElement(_ root: AXUIElement, role: String?, title: String?, identifier: String?, timeoutMs: Int) -> [String: Any]? {
    let deadline = DispatchTime.now() + .milliseconds(timeoutMs)
    let pollInterval: useconds_t = 100_000 // 100ms

    while DispatchTime.now() < deadline {
        if let found = deepFind(root, role: role, title: title, identifier: identifier) {
            var info = elementToDict(found, depth: 0, maxDepth: 0)
            if let bounds = axBounds(found) { info["bounds"] = bounds }
            return info
        }
        usleep(pollInterval)
    }
    return nil
}

// MARK: - Command Dispatch

let args = CommandLine.arguments
guard args.count >= 2 else {
    respondError("Usage: cccontrol-bridge <command> [--options]")
}

let command = args[1]

func getArg(_ flag: String) -> String? {
    guard let idx = args.firstIndex(of: flag), idx + 1 < args.count else { return nil }
    return args[idx + 1]
}

func getIntArg(_ flag: String, default defaultVal: Int) -> Int {
    guard let str = getArg(flag), let val = Int(str) else { return defaultVal }
    return val
}

// Check accessibility permission
func checkAccessibility() -> Bool {
    let options = [kAXTrustedCheckOptionPrompt.takeRetainedValue(): true] as CFDictionary
    return AXIsProcessTrustedWithOptions(options)
}

switch command {

case "check-permission":
    let trusted = checkAccessibility()
    respond(["trusted": trusted])

case "list-apps":
    let apps = NSWorkspace.shared.runningApplications
        .filter { $0.activationPolicy == .regular }
        .map { app -> [String: Any] in
            var info: [String: Any] = [
                "name": app.localizedName ?? "Unknown",
                "bundleId": app.bundleIdentifier ?? "unknown",
                "pid": app.processIdentifier,
                "active": app.isActive
            ]
            if app.isHidden { info["hidden"] = true }
            return info
        }
    respond(["apps": apps])

case "launch":
    guard let bundleId = getArg("--app") else { respondError("--app required") }
    let config = NSWorkspace.OpenConfiguration()
    config.activates = true
    let semaphore = DispatchSemaphore(value: 0)
    var launchError: Error?

    if let url = NSWorkspace.shared.urlForApplication(withBundleIdentifier: bundleId) {
        NSWorkspace.shared.openApplication(at: url, configuration: config) { _, error in
            launchError = error
            semaphore.signal()
        }
        semaphore.wait()
    } else {
        respondError("App not found: \(bundleId)")
    }

    if let err = launchError {
        respondError("Launch failed: \(err.localizedDescription)")
    }
    usleep(500_000) // 500ms for app to initialize
    respond(["launched": bundleId])

case "quit":
    guard let bundleId = getArg("--app") else { respondError("--app required") }
    guard let app = findProcess(bundleId: bundleId) else { respondError("App not running: \(bundleId)") }
    app.terminate()
    respond(["quit": bundleId])

case "tree":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let maxDepth = getIntArg("--depth", default: 5)
    let ax = axApp(for: app)
    let tree = elementToDict(ax, depth: 0, maxDepth: maxDepth)
    respond(tree)

case "find":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let role = getArg("--role")
    let title = getArg("--title")
    let desc = getArg("--desc")
    let identifier = getArg("--id")
    let maxResults = getIntArg("--max", default: 20)
    let ax = axApp(for: app)
    let results = findElements(ax, role: role, title: title, desc: desc, identifier: identifier, maxResults: maxResults)
    respond(["elements": results, "count": results.count])

case "click":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)

    // Activate the app first
    app.activate()
    usleep(50000)

    var element: AXUIElement?
    if let pathStr = getArg("--path"), let data = pathStr.data(using: .utf8),
       let path = try? JSONSerialization.jsonObject(with: data) as? [[String: Any]] {
        if path.count == 1 {
            // Single-segment path: use deepFind for full tree search
            let seg = path[0]
            element = deepFind(ax, role: seg["role"] as? String, title: seg["title"] as? String, desc: seg["desc"] as? String, identifier: seg["id"] as? String)
        } else {
            element = resolveElement(ax, path: path)
        }
    } else {
        let role = getArg("--role")
        let title = getArg("--title")
        let desc = getArg("--desc")
        let identifier = getArg("--id")
        let index = getIntArg("--index", default: 0)
        element = deepFind(ax, role: role, title: title, desc: desc, identifier: identifier, index: index)
    }

    guard let el = element else { respondError("Element not found") }
    let success = performClick(el)
    respond(["clicked": success])

case "double-click":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)
    app.activate()
    usleep(50000)

    let role = getArg("--role")
    let title = getArg("--title")
    let desc = getArg("--desc")
    let identifier = getArg("--id")
    let index = getIntArg("--index", default: 0)
    guard let el = deepFind(ax, role: role, title: title, desc: desc, identifier: identifier, index: index) else { respondError("Element not found") }
    let success = performDoubleClick(el)
    respond(["doubleClicked": success])

case "right-click":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)
    app.activate()
    usleep(50000)

    let role = getArg("--role")
    let title = getArg("--title")
    let desc = getArg("--desc")
    let identifier = getArg("--id")
    let index = getIntArg("--index", default: 0)
    guard let el = deepFind(ax, role: role, title: title, desc: desc, identifier: identifier, index: index) else { respondError("Element not found") }
    let success = performRightClick(el)
    respond(["rightClicked": success])

case "click-at":
    let x = Double(getArg("--x") ?? "") ?? -1
    let y = Double(getArg("--y") ?? "") ?? -1
    guard x >= 0 && y >= 0 else { respondError("--x and --y required (screen coordinates)") }

    if let appId = getArg("--app"), let app = resolveApp(appId) {
        app.activate()
        usleep(100000)
    }

    let point = CGPoint(x: x, y: y)
    let mouseDown = CGEvent(mouseEventSource: nil, mouseType: .leftMouseDown, mouseCursorPosition: point, mouseButton: .left)
    let mouseUp = CGEvent(mouseEventSource: nil, mouseType: .leftMouseUp, mouseCursorPosition: point, mouseButton: .left)
    mouseDown?.post(tap: .cghidEventTap)
    usleep(50000)
    mouseUp?.post(tap: .cghidEventTap)
    respond(["clickedAt": ["x": x, "y": y]])

case "type":
    guard let text = getArg("--text") else { respondError("--text required") }
    if let appId = getArg("--app"), let app = resolveApp(appId) {
        app.activate()
        usleep(100000)
    }
    typeText(text)
    respond(["typed": text.count])

case "shortcut":
    guard let keys = getArg("--keys") else { respondError("--keys required") }
    if let appId = getArg("--app"), let app = resolveApp(appId) {
        app.activate()
        usleep(100000)
    }
    sendShortcut(keys)
    respond(["shortcut": keys])

case "state":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)

    let role = getArg("--role")
    let title = getArg("--title")
    let desc = getArg("--desc")
    let identifier = getArg("--id")
    guard let el = deepFind(ax, role: role, title: title, desc: desc, identifier: identifier) else { respondError("Element not found") }

    var info = elementToDict(el, depth: 0, maxDepth: 0)
    if let bounds = axBounds(el) { info["bounds"] = bounds }
    respond(info)

case "screenshot":
    let bundleId = getArg("--app")
    let format = getArg("--format") ?? "jpg"
    guard let base64 = takeScreenshot(bundleId: bundleId, format: format) else {
        respondError("Screenshot failed")
    }
    respond(["image": base64, "format": format])

case "menu":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)
    app.activate()
    usleep(100000)

    guard let pathStr = getArg("--path") else { respondError("--path required (comma-separated menu path)") }
    let menuPath = pathStr.split(separator: ",").map { $0.trimmingCharacters(in: .whitespaces) }
    let success = navigateMenu(ax, menuPath: menuPath)
    respond(["menuClicked": success, "path": menuPath])

case "wait-for":
    guard let appId = getArg("--app") else { respondError("--app required") }
    guard let app = resolveApp(appId) else { respondError("App not found: \(appId)") }
    let ax = axApp(for: app)

    let role = getArg("--role")
    let title = getArg("--title")
    let identifier = getArg("--id")
    let timeout = getIntArg("--timeout", default: 5000)

    if let result = waitForElement(ax, role: role, title: title, identifier: identifier, timeoutMs: timeout) {
        respond(["found": true, "element": result])
    } else {
        respond(["found": false, "timeout": timeout])
    }

default:
    respondError("Unknown command: \(command). Available: check-permission, list-apps, launch, quit, tree, find, click, click-at, double-click, right-click, type, shortcut, state, screenshot, menu, wait-for")
}
