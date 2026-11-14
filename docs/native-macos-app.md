# macOS 27 原生 SwiftUI 组件展示 App

> 本文件由 `tools/gen-docs.py` 生成。组件的名称、nodeId、变体、属性轴、SwiftUI 对应全部登记在 [macos-components.md](macos-components.md)（**登记表**），实现进度登记在 `native/macos/IMPLEMENTATION.md`。

## 1. 目标

- 用 SwiftUI 做一个原生 macOS App，把登记表里的页面和组件族用**系统真实控件**渲染出来。看到的是系统本身的样子，不是图片，也不是网页模拟。
- 只展示，不做业务逻辑；不联网；**不依赖 SVG**（Figma 导出图还没下载，v1 不做，不要为它写任何代码）。
- **登记表和 App 一一对应**：登记表里的每个页面、每个族、每个独立组件，在 App 里都必须有位置。做不到真实渲染的，也要显示出来并写明原因，不能静默漏掉。
- 规模：36 个页面（含 4 个令牌页），71 个公开族，17 个独立组件，869 个变体，55 个内部件。
- 页面级别分布（定义见登记表第 5 节）：原生 30　桥接 2　部分 2　自绘 1　不做 1

## 2. 工程与环境（已在本机核实）

| 项 | 值 |
|---|---|
| Xcode / Swift | 27.2 / 6.4.2 |
| SDK | macOS 27.2 |
| 工程生成 | XcodeGen 2.46.0（`/opt/homebrew/bin/xcodegen`） |
| 部署目标 | macOS 27.0 |
| 语言模式 | Swift 6，严格并发检查 |
| 第三方依赖 | 无，禁止引入 |

- 工程由 `native/macos/project.yml` 描述，`xcodegen generate` 生成 `ComponentGalleryMac.xcodeproj`（已被 `.gitignore` 忽略，不要提交）。
- 目录：

```
native/macos/
  project.yml
  IMPLEMENTATION.md        实现登记表，开发 agent 持续维护
  scripts/build-data.py    数据脚本
  ComponentGalleryMac/
    App/                   @main 入口、根视图
    Shell/                 浮窗按钮、切换面板、主题与设置
    Registry/              registry.json 的模型与加载
    Pages/                 每个 Figma 页面一个文件夹：页面视图 + 各族的演示视图
    Resources/             registry.json（生成物，已忽略）、Assets
```

- 构建命令（产物放 `native/macos/build/`，已忽略）：

```
xcodebuild -project native/macos/ComponentGalleryMac.xcodeproj -scheme ComponentGalleryMac \
  -destination 'platform=macOS' -derivedDataPath native/macos/build CODE_SIGNING_ALLOWED=NO build
```

## 3. 数据：registry.json

- 由 `native/macos/scripts/build-data.py` 生成到 `ComponentGalleryMac/Resources/registry.json`。脚本用 `sys.path.insert(0, <仓库根>/tools)` 后 `from refdata import ...`、`from swiftui_map import MAP` 复用公共代码。
- 可只读参考网页版的数据脚本 `apps/macos/scripts/build-data.py`：复制思路改写，**不要 import、不要修改**。
- 内容：分类 → 页面 → 族（id、名称、是否内部件、属性轴、变体名与轴值、尺寸）+ 独立组件 + 内部件 + 4 个令牌页 + 每页的 HIG 链接和 SwiftUI 对应（级别与说明）。
- 脚本末尾打印对账数字：页面 **36**、公开族 **71**、独立组件 **17**、变体 **869**。
- App 运行时只读这份 JSON，用 `async` 加载，不直接读 `reference/`。

## 4. App 外壳

1. **浮窗按钮**：右下角圆形按钮（`.glassEffect()`），叠在内容之上常驻。点击或按 `⌘K` 打开切换面板。
2. **面板**：窗口内的悬浮卡片（不是 sheet）。顶部搜索框，下面按 8 个分类分组列出全部页面，每项显示公开族数量。搜索范围是页面名和公开族名。`↑` `↓` 选择，`Return` 跳转，`Esc` 关闭。
3. **翻页**：面板和输入框都没有焦点时，`←` `→` 切上一页或下一页，顺序与登记表一致，首尾循环（用 `.onKeyPress`）。
4. **明暗开关**：面板里放 Light / Dark / 跟随系统 分段控件，默认跟随系统，用窗口级 `.preferredColorScheme(_:)`。
5. **记住位置**：上次浏览的页面存 `@AppStorage`，下次启动回到原处。
6. **窗口**：默认 1200×800，最小 900×600，可自由缩放。

## 5. 页面渲染规则

1. 一个 Figma 页面对应一个 `<PageName>Page` 视图。顶部显示：页面名、分类、HIG 链接、SwiftUI 对应（级别和 API）、族数。
2. 每个公开族一个区块：族名（Figma 原名）、变体数、属性轴说明、**真实控件演示**。
3. **属性轴 → SwiftUI 做法**（能静态复现的必须复现）：

| 轴 / 值 | 做法 |
|---|---|
| `Mode`: Light / Dark | 全局明暗开关控制，区块内不重复展示 |
| `Size`: Mini / Small / Medium / Large / XL | `.controlSize(.mini / .small / .regular / .large / .extraLarge)` |
| `State`: Disabled（含拼写错的 Disabeld） | `.disabled(true)` |
| `State`: Idle / Default | 默认状态 |
| `State`: Focused | `@FocusState` 强制聚焦 |
| `State`: Clicked / Pressed / Hover | 无法静态强制：放一个可交互的真实控件，旁边标注「交互态，请手动按住或悬停」 |
| `Selection` / `On` / `Selected` / `Expanded`: True / False / Mixed | 绑定 `@State` 逐个展示 |
| `Active`: False（窗口未激活，仅 macOS） | 尝试 `.environment(\.controlActiveState, .inactive)`；不生效就标注无法复现 |
| `Context`: Over-Glass / Content Area | Over-Glass 放在 `.glassEffect` 或 `Material` 背景上，Content Area 放在普通背景上 |
| `Style`: Bordered / Borderless / Prominent 等 | 对应 `.buttonStyle`、`.textFieldStyle`、`.listStyle` 等样式修饰符 |
| 其他轴（`Type`、`Color`、`Edge`、`Display`、`Orientation` 等） | 按名字找对应的 SwiftUI 参数；找不到就只展示默认值并登记 |

4. **没有复现的变体**不能静默省略：在区块里用灰色小字列出「轴值 + 原因」，并写进 `IMPLEMENTATION.md` 的备注。
5. **桥接**：只有登记表里级别为「桥接」「部分」的页面，才允许用 AppKit（`NSViewRepresentable`）。每处必须在 `IMPLEMENTATION.md` 备注里写明原因。其余页面禁止。
6. **自绘**页面：用 SwiftUI 视图模拟外观，页面顶部固定显示一行「模拟外观，系统不提供真实控件」。
7. **尚未实现的族**：显示占位卡（族名、nodeId、属性轴、变体数、SwiftUI 对应），保证目录完整，进度一目了然。
8. **独立组件**平铺在页面末尾。**内部件**放折叠区，只列名字，不做演示，也不参与搜索。
9. **令牌页**（4 个）：颜色（色块 + hex + alpha + 使用次数 + 渐变）、文字样式（用系统字体真实渲染样例）、效果（`Material` 和 `.glassEffect` 实物）、几何（圆角、间距、尺寸数值）。

## 6. 实现登记（`native/macos/IMPLEMENTATION.md`）

- 骨架已由脚本生成，每个族、独立组件、内部件一行，共 **147** 行；脚本不会覆盖已存在的文件，之后由开发 agent 维护。
- 列：类型 · 名称 · nodeId · 变体 · 状态 · SwiftUI 实现 · 文件 · 备注。
- 状态只用这五个值：`未开始`、`已实现`、`部分实现`、`无法实现`、`内部件`。
- 每实现一个族，**立即**更新它的行：写清用了哪个 SwiftUI 类型和修饰符、所在文件、哪些变体没复现。
- `无法实现` 必须写原因，例如「通知横幅由系统绘制」。
- 目的：以后写业务代码时，查这张表就知道每个 Figma 组件在 SwiftUI 里怎么写。

## 7. Skills（`.agent/skills/`，必须使用）

| Skill | 用法 |
|---|---|
| `swiftui-pro` | **全程使用。** 写每个文件前读 `SKILL.md` 和相关 `references/`；完成后按它的审查流程自检并修复。要点：Swift 6.4、一个文件一个类型、不用第三方、除桥接外不用 UIKit / AppKit、用 `foregroundStyle`、`Tab`、`clipShape(.rect(cornerRadius:))`、语义化的 toolbar placement、无障碍与本地化 |
| `swift-concurrency-pro` | registry 加载、`@MainActor`、`Sendable` 相关代码用它把关。优先结构化并发，禁止用 `@unchecked Sendable` 糊弄编译器 |
| `swift-testing-pro` | **本期不用。** 你要求开发过程中不写测试，最后由你亲自验收 |
| `swiftdata-pro` | **本期不用。** 没有持久化需求，偏好设置存 `@AppStorage` |

## 8. 分步与验收

| 步骤 | 内容 | 验收 |
|---|---|---|
| N1 工程与数据 | `project.yml`、数据脚本、`registry.json` | 对账数字与第 3 节一致；`xcodegen generate` 成功 |
| N2 外壳与骨架 | 浮窗按钮、面板、搜索、翻页、主题；所有页面和族先显示占位卡 | 构建通过；登记表里每个页面都能到达 |
| N3 令牌页 | 4 个令牌页 | 构建通过 |
| N4 控件与输入 | 分类 `03-controls`、`04-input` | 构建通过；`IMPLEMENTATION.md` 同步更新 |
| N5 集合、导航、栏 | 分类 `05-collections`、`01-navigation`、`02-bars` | 同上 |
| N6 浮层与系统 | 分类 `06-overlays`、`07-system`（自绘页放最后） | 同上 |
| N7 自检 | 按 `swiftui-pro` 审查流程过一遍全部代码并修复；用 `swift-concurrency-pro` 复核异步代码 | 构建通过；`IMPLEMENTATION.md` 里没有「未开始」，每个都有结论 |

每步结束都要 `xcodebuild build` 成功。不写测试，不截图，不启动 App，最后由你验收。

## 9. 已决定

1. 用原生 SwiftUI，真实控件渲染。
2. SVG 不依赖，v1 不做。
3. 网页版（`apps/macos`）保留，不改动。
4. 桥接页面允许用 AppKit，其余页面禁止。
5. 内部件不参与搜索。
6. 整屏类页面（`Windows`、`Menu Bar and Dock` 等）缩放到适应宽度。
