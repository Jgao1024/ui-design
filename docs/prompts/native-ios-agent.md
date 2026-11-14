# 任务：实现 iOS 27 原生 SwiftUI 组件展示 App

## 0. 边界（先读，必须遵守）

- **只能写入 `native/ios/` 下的文件。**
- 只读，不得修改：
  - `docs/native-ios-app.md`（**需求文档**，全文都是需求）
  - `docs/ios-components.md`（**登记表**：全部页面、族、nodeId、属性轴、SwiftUI 对应）
  - `reference/ios27/`、`reference/_raw/ios27-*.json`
  - `tools/refdata.py`、`tools/swiftui_map.py`
  - `apps/ios/scripts/build-data.py`（网页版数据脚本，只能读来参考，不能 import 或改）
  - `.agent/skills/`
- 禁止创建或修改：`native/macos/**`、`apps/**`、`docs/**`、`tools/**`、根目录所有文件、`reference/**`。
- 不跑 git 命令，不读 `.figma.env`，不引入第三方依赖，**不依赖 SVG**。
- 另一个 agent 在同时开发 macOS 原生 App，两边互不依赖，不要 import 对方的任何东西。
- 构建产物只放 `native/ios/build/`（用 `-derivedDataPath`），不要碰默认 DerivedData，不要启动或关闭 Xcode。
- **不要启动、关闭或修改模拟器**（不跑 `xcrun simctl boot` 等），构建只需要指定目标，不需要模拟器运行。

## 1. 先读这些（按顺序）

1. `docs/native-ios-app.md`：完整读完，这是你的需求。
2. `docs/ios-components.md`：第 5 节每页第一行的 **SwiftUI 对应**是你的实现依据。
3. `native/ios/IMPLEMENTATION.md`：已生成 285 行骨架，你要一行一行把它做完。
4. **Skills**（`.agent/skills/`）：
   - `swiftui-pro/SKILL.md`，以及 `references/` 下的 `api.md`、`views.md`、`data.md`、`navigation.md`、`design.md`、`accessibility.md`、`localization.md`、`performance.md`、`swift.md`、`hygiene.md`，**还有 `resizability.md`（iPad 窗口缩放和 iPhone Duo，iOS 版必读）**。写代码前读，写完后按它的审查流程自检。
   - `swift-concurrency-pro/SKILL.md`，重点读 `references/hotspots.md` 和 `new-features.md`。
   - `swift-testing-pro` 和 `swiftdata-pro` 本期不用。

## 2. 核心要求

- 目标是**用系统真实控件渲染**，让我看到系统原本的样子。不是画图，不是网页。
- 登记表里的**每个页面、每个族、每个独立组件**都必须在 App 里有位置，并在 `IMPLEMENTATION.md` 里有结论。做不到的写 `无法实现` 加原因，不能漏。
- 代码规范（来自 `swiftui-pro`）：Swift 6.4、严格并发、**一个文件一个类型**、不用任何第三方库、现代 API（`foregroundStyle`、`Tab`、`clipShape(.rect(cornerRadius:))`、语义化 toolbar placement 等）、Xcode 27 用 `@ContentBuilder`。
- UIKit 只允许用在登记表里级别为「桥接」「部分」的页面，且每处都要在 `IMPLEMENTATION.md` 备注里写原因。
- 外壳要按需求文档第 4 节实现，**包括设备筛选**（全部 / iPhone / iPad / iPhone Duo，默认 iPhone）。
- **用 API 前先在 SDK 接口里核对存在**，不要凭记忆写：

```
SDK=$(xcrun --sdk iphoneos --show-sdk-path)/System/Library/Frameworks
grep -n "你要找的名字" "$SDK/SwiftUI.framework/Modules/SwiftUI.swiftmodule/arm64e-apple-ios.swiftinterface" "$SDK/SwiftUICore.framework/Modules/SwiftUICore.swiftmodule/arm64e-apple-ios.swiftinterface"
```

## 3. 工程与命令

- 工程文件：`native/ios/project.yml`（XcodeGen）。目录结构、目标名 `ComponentGalleryiOS`、部署目标 iOS 27.0、Swift 6 语言模式，见需求文档第 2 节。
- 生成工程：`cd native/ios && xcodegen generate`
- 数据：`python3 native/ios/scripts/build-data.py`，对账数字必须是 **页面 39、公开族 81、独立组件 67、变体 520**。
- 构建（每步结束都要成功）：

```
xcodebuild -project native/ios/ComponentGalleryiOS.xcodeproj -scheme ComponentGalleryiOS \
  -destination 'platform=iOS Simulator,name=iPhone 18 Pro' -derivedDataPath native/ios/build CODE_SIGNING_ALLOWED=NO build
```

## 4. 分步执行

按需求文档第 8 节 N1 到 N7 顺序，一步做完再做下一步：

1. N1 工程与数据：`project.yml`、`build-data.py`、`registry.json`
2. N2 外壳与骨架：浮窗按钮、面板、搜索、设备筛选、翻页、明暗开关；所有页面和族先以占位卡显示
3. N3 四个令牌页
4. N4 控件与输入（`03-controls`、`04-input`）
5. N5 集合、导航、栏（`05-collections`、`01-navigation`、`02-bars`）
6. N6 浮层与系统（`06-overlays`、`07-system`，自绘页最后）
7. N7 自检：用 `swiftui-pro` 审查流程过一遍全部代码并修复；用 `swift-concurrency-pro` 复核异步代码

**每实现一个族，立即更新 `IMPLEMENTATION.md` 里它的那一行**（状态、SwiftUI 实现、文件、备注）。

## 5. 测试策略

我要求开发过程中**不做测试**，最后我亲自验收。

- 不写测试，不截图，不启动 App，不跑 UI 自动化。
- 允许且要求：每步结束 `xcodebuild build` 成功。

## 6. 交付报告（最后一条消息）

1. N1 到 N7 各一行完成情况。
2. `IMPLEMENTATION.md` 状态统计：已实现 / 部分实现 / 无法实现 / 未开始 / 内部件 各多少行。
3. 数据脚本打印的四个对账数字，和最后一次构建结果。
4. 所有 UIKit 桥接点清单。
5. 与需求不一致的地方，和你不确定的地方。
6. 运行方式：用 Xcode 打开 `native/ios/ComponentGalleryiOS.xcodeproj`，选 iPhone 18 Pro 模拟器运行。
