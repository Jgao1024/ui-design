# 任务：实现 macOS 27 原生 SwiftUI 组件展示 App

## 0. 边界（先读，必须遵守）

- **只能写入 `native/macos/` 下的文件。**
- 只读，不得修改：
  - `docs/native-macos-app.md`（**需求文档**，全文都是需求）
  - `docs/macos-components.md`（**登记表**：全部页面、族、nodeId、属性轴、SwiftUI 对应）
  - `Figma/reference/macos27/`、`Figma/reference/_raw/macos27-*.json`
  - `Figma/tools/refdata.py`、`Figma/tools/swiftui_map.py`
  - `apps/macos/scripts/build-data.py`（网页版数据脚本，只能读来参考，不能 import 或改）
  - `.agent/skills/`
- 禁止创建或修改：`native/ios/**`、`apps/**`、`docs/**`、`Figma/tools/**`、根目录所有文件、`Figma/reference/**`。
- 不跑 git 命令，不读 `.figma.env`，不引入第三方依赖，**不依赖 SVG**。
- 另一个 agent 在同时开发 iOS 原生 App，两边互不依赖，不要 import 对方的任何东西。
- 构建产物只放 `native/macos/build/`（用 `-derivedDataPath`），不要碰默认 DerivedData，不要启动或关闭 Xcode。

## 1. 先读这些（按顺序）

1. `docs/native-macos-app.md`：完整读完，这是你的需求。
2. `docs/macos-components.md`：第 5 节每页第一行的 **SwiftUI 对应**是你的实现依据。
3. `native/macos/IMPLEMENTATION.md`：已生成 147 行骨架，你要一行一行把它做完。
4. **Skills**（`.agent/skills/`）：
   - `swiftui-pro/SKILL.md`，以及 `references/` 下的 `api.md`、`views.md`、`data.md`、`navigation.md`、`design.md`、`accessibility.md`、`localization.md`、`performance.md`、`swift.md`、`hygiene.md`。**写代码前读，写完后按它的审查流程自检。**
   - `swift-concurrency-pro/SKILL.md`，重点读 `references/hotspots.md` 和 `new-features.md`。
   - `swift-testing-pro` 和 `swiftdata-pro` 本期不用。

## 2. 核心要求

- 目标是**用系统真实控件渲染**，让我看到系统原本的样子。不是画图，不是网页。
- 登记表里的**每个页面、每个族、每个独立组件**都必须在 App 里有位置，并在 `IMPLEMENTATION.md` 里有结论。做不到的写 `无法实现` 加原因，不能漏。
- 代码规范（来自 `swiftui-pro`）：Swift 6.4、严格并发、**一个文件一个类型**、不用任何第三方库、现代 API（`foregroundStyle`、`Tab`、`clipShape(.rect(cornerRadius:))` 等）、Xcode 27 用 `@ContentBuilder`。
- AppKit 只允许用在登记表里级别为「桥接」「部分」的页面，且每处都要在 `IMPLEMENTATION.md` 备注里写原因。
- **用 API 前先在 SDK 接口里核对存在**，不要凭记忆写：

```
SDK=/Applications/Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX27.2.sdk/System/Library/Frameworks
grep -n "你要找的名字" "$SDK/SwiftUI.framework/Versions/A/Modules/SwiftUI.swiftmodule/arm64e-apple-macos.swiftinterface" "$SDK/SwiftUICore.framework/Versions/A/Modules/SwiftUICore.swiftmodule/arm64e-apple-macos.swiftinterface"
```

## 3. 工程与命令

- 工程文件：`native/macos/project.yml`（XcodeGen）。目录结构、目标名 `ComponentGalleryMac`、部署目标 macOS 27.0、Swift 6 语言模式，见需求文档第 2 节。
- 生成工程：`cd native/macos && xcodegen generate`
- 数据：`python3 native/macos/scripts/build-data.py`，对账数字必须是 **页面 36、公开族 71、独立组件 17、变体 869**。
- 构建（每步结束都要成功）：

```
xcodebuild -project native/macos/ComponentGalleryMac.xcodeproj -scheme ComponentGalleryMac \
  -destination 'platform=macOS' -derivedDataPath native/macos/build CODE_SIGNING_ALLOWED=NO build
```

## 4. 分步执行

按需求文档第 8 节 N1 到 N7 顺序，一步做完再做下一步：

1. N1 工程与数据：`project.yml`、`build-data.py`、`registry.json`
2. N2 外壳与骨架：浮窗按钮、`⌘K` 面板、搜索、`←` `→`、明暗开关；所有页面和族先以占位卡显示
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
4. 所有 AppKit 桥接点清单。
5. 与需求不一致的地方，和你不确定的地方。
6. 运行方式：用 Xcode 打开 `native/macos/ComponentGalleryMac.xcodeproj` 运行。
