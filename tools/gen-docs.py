#!/usr/bin/env python3
"""从 reference/_raw 的 Figma 原始树生成文档：
  docs/macos-components.md、docs/ios-components.md      组件登记表（清单 + SwiftUI 对应）
  docs/native-macos-app.md、docs/native-ios-app.md      原生 SwiftUI App 需求
  native/macos/IMPLEMENTATION.md、native/ios/IMPLEMENTATION.md   实现登记表骨架（已存在则不覆盖，由开发 agent 维护）

只读本地缓存，不访问网络。清单（第 5 节）完全由脚本生成；其余章节的文字在本文件的 TEMPLATE 里改。
用法：python3 tools/gen-docs.py [macos27|ios27]   （不带参数则两份都生成）
"""
import collections
import json
import sys

from refdata import CATEGORY_LABEL, HIG, HIG_URL, REF, ROOT, TOKEN_PAGES, walk
from swiftui_map import MAP

OUT = ROOT / "docs"

TEMPLATE = """# {title}

> 本文件由 `tools/gen-docs.py` 生成，第 5 节的清单**不要手改**；其余章节的文字改脚本里的 TEMPLATE 后重新生成。
> 数据源：`reference/{kit}/`（Apple 官方 {label} UI Kit 抽取）。生成时间以数据为准，无时间戳。

## 1. 文档分工与范围

- 本文是 {label} 的**组件登记表**：列出 Figma kit 里**全部**页面、组件族、独立组件、内部件，登记名称、nodeId、变体、属性轴、HIG 链接和 **SwiftUI 对应**（见第 5 节）。以后写业务代码，先查这里。
- **原生 SwiftUI App** 的需求见 [native-{x}-app.md](native-{x}-app.md)，实现进度登记在 `native/{x}/IMPLEMENTATION.md`。
- **网页版**（`apps/{x}`，TypeScript，已完成并保留）的需求就是本文第 2、3、8 节，原生版不适用这三节。
- 本文档只管 {label}。另一个平台有独立文档，两边代码、数据、目录完全独立，互不依赖。
- 数据规模：**{n_pages} 个展示页面**（8 个分类），**{n_pub} 个公开组件族**，{n_solo} 个独立组件，{n_var} 个变体，{n_int} 个内部件（默认隐藏）。

## 2. 切换与导航（网页版，已完成）

1. **右下角浮窗按钮**：固定在视口右下角，任何页面都可见。点击打开面板，也可按 `⌘K`。
2. **面板内容**：顶部搜索框；下面按 8 个分类分组列出所有页面，每项显示公开组件族数量。搜索范围是页面名和公开族名。`↑` `↓` 选择，`Enter` 跳转，`Esc` 关闭。
3. **快速翻页**：`←` `→` 切到上一页或下一页，顺序与第 5 节一致，首尾循环。
4. **地址可分享**：URL 用 hash 路由，`#/<页面slug>` 和 `#/<页面slug>/<族nodeId>`（nodeId 里的 `:` 换成 `-`）。刷新后停留在原位置。
5. **全局明暗开关**：浮窗面板里放一个 Light / Dark / 跟随系统 开关，默认跟随系统。
{extra_nav}
## 3. 页面布局规则（网页版，已完成）

1. 页面顶部：页面名、所属分类、HIG 链接（见第 5 节）、族数与变体数。
2. 每个公开族一个区块：标题 + 变体数 + 变体网格。
3. **属性轴 → 网格**：
   - 含 `Light` / `Dark` 值的轴（通常叫 `Mode`）由全局明暗开关控制，不占网格。{mode_note}
   - 其余轴按第 5 节表格中出现的顺序：第 1 个轴作列，第 2 个轴作行，第 3 个及以后的轴拆成多个带标题的子网格。
4. **变体单元格**：图（SVG）+ 轴值标签。点击打开右侧**只读规格面板**：尺寸、圆角、颜色（hex）、字体、效果，数据来自 `specs/*.json`。
5. **SVG 未就绪时**：显示灰色占位矩形，尺寸取变体 bbox，附标签。SVG 导出完成后重跑数据脚本即可替换，无需改前端代码。
6. 页面末尾依次放：**独立组件**（不属于任何族，平铺）、**内部件**（以 `_` 开头，默认折叠，有开关展开）。
7. **整屏类大图缩放到适应单元格宽度**（fit-to-width），不出现横向滚动条。
8. 变体最多的族见下表，渲染要保证流畅：

{heavy}

## 4. 数据来源与匹配规则

| 内容 | 位置 | 说明 |
|---|---|---|
| 组件族清单与层级 | `reference/_raw/{kit}-file.json` | **只有这里有族 → 变体的关系**（`COMPONENT_SET` 的子节点） |
| 变体规格 | `reference/{kit}/specs/<分类>/*.json` | 每变体一个文件，字段见 `layout`、`textStyles`、`descendants` |
| 变体图 | `reference/{kit}/svg/<分类>/*.svg` | 与 `specs/` 一一对应（族和变体各一个），由 Figma 插件导出，**目前为 0 个** |
| 令牌 | `reference/{kit}/tokens/*.json` | 颜色、文字、效果、几何 |

- **匹配键一律用 nodeId**。规格文件名不唯一（同名会加 `-2` 后缀），也不包含族名，不能靠文件名匹配。
- 开发第一步写一个数据脚本（放在该 App 自己的目录里，可只读引用 `tools/refdata.py`），把以上数据汇总成精简 JSON 放进 App 的 `public/data/`，App 运行时只读这份 JSON，不直接读 `reference/`。
- `reference/` 与 SVG 来自 Apple 素材，**不入 git、不发布**；生成的 JSON 同理加入 `.gitignore`。

## 5. 组件清单（脚本生成）

约定：族表的「属性轴」写作 `轴名: 值1, 值2 …`，`…+N` 表示还有 N 个值；`nodeId` 是族的唯一标识。

**SwiftUI 对应**写在每个页面的第一行，分五级（API 名称已在 Xcode 27.2 SDK 里核对存在）：

| 级别 | 含义 |
|---|---|
| 原生 | SwiftUI 公开 API 直接渲染系统真实外观 |
| 桥接 | SwiftUI 没有对应控件，需要 AppKit / UIKit 包装 |
| 部分 | 一部分用真实控件，一部分只能自绘 |
| 自绘 | 由系统进程绘制，App 拿不到真实控件，只能用 SwiftUI 模拟外观 |
| 不做 | 没有对应 API，也不是控件（如设备外框） |

页面级别分布：{levels}

{inventory}

## 6. 附加：令牌页

这几页不来自 kit 画板，直接由 `reference/{kit}/tokens/` 渲染，归入分类 `08-tokens`。kit 里同名的 `Colors`、`Materials` 画板页照常展示，二者并存。

{token_pages}

## 7. 本期不做

HIG 有页面，但 {label} kit 没有对应设计稿，需要另行手绘，**v1 不做**。列表含 watchOS、visionOS、tvOS 专属页，以及另一个平台才有的页，可直接忽略：

{missing}

## 8. 开发步骤与验收（网页版，已完成）

| 步骤 | 内容 | 验收 |
|---|---|---|
| D1 数据 | 写汇总脚本，生成精简 JSON | 页面数 {n_pages}、公开族 {n_pub}、独立组件 {n_solo}、变体 {n_var} 与第 1 节完全一致 |
| D2 外壳 | 浮窗按钮、`⌘K` 面板、搜索、`←` `→`、hash 路由、明暗开关 | 第 5 节每个页面都能从面板到达；刷新后位置不丢 |
| D3 页面 | 按第 3 节渲染所有页面（占位图） | 逐页打开无报错；变体最多的族滚动流畅 |
| D4 规格面板 | 点击变体显示只读规格 | 任选 5 个变体，数值与 `specs/*.json` 一致 |
| D5 SVG | 接入 `svg/`，自动替换占位 | 导出后 Buttons 页显示真实图，其余页不受影响 |

## 9. 已决定

{questions}
"""

QUESTIONS = {
    "macos27": [
        "整屏类页面（`Windows`、`Menu Bar and Dock` 等）用 fit-to-width 缩放展示。",
        "内部件不参与全局搜索，只在页面底部手动展开。",
    ],
    "ios27": [
        "加全局「设备」筛选（全部 / iPhone / iPad / iPhone Duo），默认 iPhone。",
        "整屏类页面（`System`、`Widgets`、`Keyboards` 等）用 fit-to-width 缩放展示。",
        "内部件不参与全局搜索，只在页面底部手动展开。",
    ],
}

EXTRA_NAV = {
    "macos27": "",
    "ios27": "6. **设备筛选**（仅 iOS）：面板里放 全部 / iPhone / iPad / iPhone Duo，默认 iPhone。族名或独立组件名里含 `iPhone Duo`、`iPad`、`iPhone` 字样的，按筛选显示（先判断 `iPhone Duo`，再判断 `iPad`，最后 `iPhone`）；不含设备词的始终显示。\n",
}

MODE_NOTE = {
    "macos27": "macOS 的 `Mode` 值基本是 Light / Dark。",
    "ios27": "iOS 的 `Mode` 轴值更杂（`Light`、`Dark`、`Default`、`Active`、`Inactive`、`IC - Light`、`IC - Dark`）。**只有同时含 Light 和 Dark 的族**受全局开关控制，其余值留在网格里当普通轴显示。",
}


NATIVE_TEMPLATE = """# {label} 原生 SwiftUI 组件展示 App

> 本文件由 `tools/gen-docs.py` 生成。组件的名称、nodeId、变体、属性轴、SwiftUI 对应全部登记在 [{x}-components.md]({x}-components.md)（**登记表**），实现进度登记在 `native/{x}/IMPLEMENTATION.md`。

## 1. 目标

- 用 SwiftUI 做一个原生 {plat} App，把登记表里的页面和组件族用**系统真实控件**渲染出来。看到的是系统本身的样子，不是图片，也不是网页模拟。
- 只展示，不做业务逻辑；不联网；**不依赖 SVG**（Figma 导出图还没下载，v1 不做，不要为它写任何代码）。
- **登记表和 App 一一对应**：登记表里的每个页面、每个族、每个独立组件，在 App 里都必须有位置。做不到真实渲染的，也要显示出来并写明原因，不能静默漏掉。
- 规模：{n_pages} 个页面（含 4 个令牌页），{n_pub} 个公开族，{n_solo} 个独立组件，{n_var} 个变体，{n_int} 个内部件。
- 页面级别分布（定义见登记表第 5 节）：{levels}

## 2. 工程与环境（已在本机核实）

| 项 | 值 |
|---|---|
| Xcode / Swift | 27.2 / 6.4.2 |
| SDK | {sdk} |
| 工程生成 | XcodeGen 2.46.0（`/opt/homebrew/bin/xcodegen`） |
| 部署目标 | {plat} 27.0 |
| 语言模式 | Swift 6，严格并发检查 |
| 第三方依赖 | 无，禁止引入 |

- 工程由 `native/{x}/project.yml` 描述，`xcodegen generate` 生成 `{proj}.xcodeproj`（已被 `.gitignore` 忽略，不要提交）。
- 目录：

```
native/{x}/
  project.yml
  IMPLEMENTATION.md        实现登记表，开发 agent 持续维护
  scripts/build-data.py    数据脚本
  {proj}/
    App/                   @main 入口、根视图
    Shell/                 浮窗按钮、切换面板、主题与设置
    Registry/              registry.json 的模型与加载
    Pages/                 每个 Figma 页面一个文件夹：页面视图 + 各族的演示视图
    Resources/             registry.json（生成物，已忽略）、Assets
```

- 构建命令（产物放 `native/{x}/build/`，已忽略）：

```
{build_cmd}
```

## 3. 数据：registry.json

- 由 `native/{x}/scripts/build-data.py` 生成到 `{proj}/Resources/registry.json`。脚本用 `sys.path.insert(0, <仓库根>/tools)` 后 `from refdata import ...`、`from swiftui_map import MAP` 复用公共代码。
- 可只读参考网页版的数据脚本 `apps/{x}/scripts/build-data.py`：复制思路改写，**不要 import、不要修改**。
- 内容：分类 → 页面 → 族（id、名称、是否内部件、属性轴、变体名与轴值、尺寸）+ 独立组件 + 内部件 + 4 个令牌页 + 每页的 HIG 链接和 SwiftUI 对应（级别与说明）。
- 脚本末尾打印对账数字：页面 **{n_pages}**、公开族 **{n_pub}**、独立组件 **{n_solo}**、变体 **{n_var}**。
- App 运行时只读这份 JSON，用 `async` 加载，不直接读 `reference/`。

## 4. App 外壳

{shell}

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
| `Active`: False（窗口未激活，仅 macOS） | 尝试 `.environment(\\.controlActiveState, .inactive)`；不生效就标注无法复现 |
| `Context`: Over-Glass / Content Area | Over-Glass 放在 `.glassEffect` 或 `Material` 背景上，Content Area 放在普通背景上 |
| `Style`: Bordered / Borderless / Prominent 等 | 对应 `.buttonStyle`、`.textFieldStyle`、`.listStyle` 等样式修饰符 |
| 其他轴（`Type`、`Color`、`Edge`、`Display`、`Orientation` 等） | 按名字找对应的 SwiftUI 参数；找不到就只展示默认值并登记 |

4. **没有复现的变体**不能静默省略：在区块里用灰色小字列出「轴值 + 原因」，并写进 `IMPLEMENTATION.md` 的备注。
5. **桥接**：只有登记表里级别为「桥接」「部分」的页面，才允许用 {bridge}。每处必须在 `IMPLEMENTATION.md` 备注里写明原因。其余页面禁止。
6. **自绘**页面：用 SwiftUI 视图模拟外观，页面顶部固定显示一行「模拟外观，系统不提供真实控件」。
7. **尚未实现的族**：显示占位卡（族名、nodeId、属性轴、变体数、SwiftUI 对应），保证目录完整，进度一目了然。
8. **独立组件**平铺在页面末尾。**内部件**放折叠区，只列名字，不做演示，也不参与搜索。
9. **令牌页**（4 个）：颜色（色块 + hex + alpha + 使用次数 + 渐变）、文字样式（用系统字体真实渲染样例）、效果（`Material` 和 `.glassEffect` 实物）、几何（圆角、间距、尺寸数值）。

## 6. 实现登记（`native/{x}/IMPLEMENTATION.md`）

- 骨架已由脚本生成，每个族、独立组件、内部件一行，共 **{rows}** 行；脚本不会覆盖已存在的文件，之后由开发 agent 维护。
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

{decided}
"""

NATIVE_SHELL = {
    "macos27": """1. **浮窗按钮**：右下角圆形按钮（`.glassEffect()`），叠在内容之上常驻。点击或按 `⌘K` 打开切换面板。
2. **面板**：窗口内的悬浮卡片（不是 sheet）。顶部搜索框，下面按 8 个分类分组列出全部页面，每项显示公开族数量。搜索范围是页面名和公开族名。`↑` `↓` 选择，`Return` 跳转，`Esc` 关闭。
3. **翻页**：面板和输入框都没有焦点时，`←` `→` 切上一页或下一页，顺序与登记表一致，首尾循环（用 `.onKeyPress`）。
4. **明暗开关**：面板里放 Light / Dark / 跟随系统 分段控件，默认跟随系统，用窗口级 `.preferredColorScheme(_:)`。
5. **记住位置**：上次浏览的页面存 `@AppStorage`，下次启动回到原处。
6. **窗口**：默认 1200×800，最小 900×600，可自由缩放。""",
    "ios27": """1. **浮窗按钮**：右下角圆形按钮（`.glassEffect()`），叠在内容之上常驻。点击打开切换面板；外接键盘时 `⌘K` 同样可用。
2. **面板**：`.sheet`，`.presentationDetents([.medium, .large])`。顶部搜索框，下面按 8 个分类分组列出全部页面，每项显示公开族数量。搜索范围是页面名和公开族名。
3. **设备筛选**：面板里放 全部 / iPhone / iPad / iPhone Duo，默认 iPhone，存 `@AppStorage`。族名或独立组件名含 `iPhone Duo`、`iPad`、`iPhone` 字样的按筛选显示（先判断 `iPhone Duo`，再判断 `iPad`，最后 `iPhone`），不含设备词的始终显示。
4. **翻页**：页面顶部放「上一页 / 下一页」按钮，顺序与登记表一致，首尾循环；外接键盘 `←` `→` 同样可用（`.onKeyPress`）。
5. **明暗开关**：面板里放 Light / Dark / 跟随系统 分段控件，默认跟随系统。
6. **记住位置**：上次浏览的页面存 `@AppStorage`。
7. **自适应**：按 `swiftui-pro` 的 `references/resizability.md`，用 size class 判断布局，不用设备类型；iPad 窗口缩放、iPhone Duo 外屏与内屏都要能用。不要自己造底栏，用系统 toolbar 和 `TabView`。
8. **运行目标**：iPhone 18 Pro 模拟器（本机已装），iPad 模拟器也要能跑。""",
}

NATIVE_EXTRA = {
    "macos27": {
        "plat": "macOS", "proj": "ComponentGalleryMac", "sdk": "macOS 27.2",
        "bridge": "AppKit（`NSViewRepresentable`）",
        "build_cmd": "xcodebuild -project native/macos/ComponentGalleryMac.xcodeproj -scheme ComponentGalleryMac \\\n  -destination 'platform=macOS' -derivedDataPath native/macos/build CODE_SIGNING_ALLOWED=NO build",
        "decided": "1. 用原生 SwiftUI，真实控件渲染。\n2. SVG 不依赖，v1 不做。\n3. 网页版（`apps/macos`）保留，不改动。\n4. 桥接页面允许用 AppKit，其余页面禁止。\n5. 内部件不参与搜索。\n6. 整屏类页面（`Windows`、`Menu Bar and Dock` 等）缩放到适应宽度。",
    },
    "ios27": {
        "plat": "iOS", "proj": "ComponentGalleryiOS", "sdk": "iOS 27.2 / iOS Simulator 27.2",
        "bridge": "UIKit（`UIViewRepresentable`）",
        "build_cmd": "xcodebuild -project native/ios/ComponentGalleryiOS.xcodeproj -scheme ComponentGalleryiOS \\\n  -destination 'platform=iOS Simulator,name=iPhone 18 Pro' -derivedDataPath native/ios/build CODE_SIGNING_ALLOWED=NO build",
        "decided": "1. 用原生 SwiftUI，真实控件渲染。\n2. SVG 不依赖，v1 不做。\n3. 网页版（`apps/ios`）保留，不改动。\n4. 桥接页面允许用 UIKit，其余页面禁止。\n5. 加全局设备筛选，默认 iPhone。\n6. 内部件不参与搜索。\n7. 整屏类页面（`System`、`Widgets`、`Keyboards` 等）缩放到适应宽度。",
    },
}

STATUS_LEGEND = "状态只用五个值：`未开始`、`已实现`、`部分实现`、`无法实现`、`内部件`。"


def esc(s):
    return str(s).replace("|", "\\|").replace("\n", " ")


def axes_text(axes):
    parts = []
    for k, vals in axes.items():
        shown = ", ".join(vals[:6]) + (f" …+{len(vals) - 6}" if len(vals) > 6 else "")
        parts.append(f"{k}: {shown}")
    return esc(" · ".join(parts)) or "—"


def build(kit):
    label = "macOS 27" if kit == "macos27" else "iOS 27"
    raw = json.load(open(REF / "_raw" / f"{kit}-file.json"))
    doc = raw.get("document", raw)
    inv = {"sets": [], "solo": []}
    for pg in doc["children"]:
        walk(pg, pg["name"], False, inv)
    manifest = json.load(open(REF / kit / "MANIFEST.json"))
    pages = [p for p in manifest["pages"] if p["bucket"] != "00-meta"]
    by_bucket = collections.defaultdict(list)
    for p in pages:
        by_bucket[p["bucket"]].append(p["page"])

    hig = HIG[kit]
    is_int = lambda n: n.startswith("_")
    lines, n_pages = [], 0
    records, level_count = [], collections.Counter()
    n_pub = n_solo = n_var = n_int = 0
    all_pub = []
    for bucket in sorted(by_bucket):
        lines.append(f"### {bucket} {CATEGORY_LABEL[bucket]}\n")
        for page in by_bucket[bucket]:
            sets = [s for s in inv["sets"] if s["page"] == page]
            solo = [s for s in inv["solo"] if s["page"] == page]
            pub = [s for s in sets if not is_int(s["name"])]
            internal = [s for s in sets if is_int(s["name"])] + [s for s in solo if is_int(s["name"])]
            solo_pub = [s for s in solo if not is_int(s["name"])]
            if bucket == "08-tokens" and not sets and not solo:   # 空的令牌画板页（Text Styles 等），内容见第 6 节令牌页
                continue
            n_pages += 1
            n_pub += len(pub)
            n_solo += len(solo_pub)
            n_var += sum(s["variants"] for s in pub)
            n_int += len(internal)
            all_pub += [(page, s) for s in pub]
            links = " · ".join(f"[{h}]({HIG_URL}{h})" for h in hig.get(page, [])) or "无对应 HIG 页"
            level, apis = MAP[kit][page]
            level_count[level] += 1
            records.append({"bucket": bucket, "page": page, "level": level, "apis": apis,
                            "pub": pub, "solo": solo_pub, "internal": internal})
            lines.append(f"#### {page}\n")
            lines.append(f"SwiftUI：**{level}**　{apis}\n")
            lines.append(f"HIG：{links}　|　公开族 {len(pub)} · 独立组件 {len(solo_pub)} · "
                         f"变体 {sum(s['variants'] for s in pub)} · 内部件 {len(internal)}\n")
            if pub:
                lines.append("| 族 | 变体 | 属性轴 | nodeId |\n|---|---|---|---|")
                for s in pub:
                    lines.append(f"| {esc(s['name'])} | {s['variants']} | {axes_text(s['axes'])} | `{s['id']}` |")
                lines.append("")
            if solo_pub:
                lines.append("独立组件：" + "；".join(f"{esc(s['name'])} `{s['id']}`" for s in solo_pub) + "\n")
            if internal:
                names = "；".join(esc(s["name"]) for s in internal)
                lines.append(f"<details><summary>内部件 {len(internal)} 个（默认隐藏）</summary>\n\n{names}\n\n</details>\n")
            if not pub and not solo_pub and not internal:
                lines.append("（无画板内容，见第 6 节令牌页。）\n")

    heavy_rows = sorted(all_pub, key=lambda x: -x[1]["variants"])[:5]
    heavy = "| 页面 | 族 | 变体数 |\n|---|---|---|\n" + "\n".join(
        f"| {p} | {esc(s['name'])} | {s['variants']} |" for p, s in heavy_rows)

    token_lines = []
    for fn, keys, name, desc in TOKEN_PAGES:
        d = json.load(open(REF / kit / "tokens" / fn))
        counts = "，".join(f"{k} {len(d[k])}" for k in keys)
        tslug = "tokens-" + fn[:-5]
        level, apis = MAP[kit][tslug]
        level_count[level] += 1
        token_lines.append(f"- **{name}**（`tokens/{fn}`：{counts}）：{desc}。SwiftUI：**{level}**　{apis}")
    n_pages += len(TOKEN_PAGES)

    mapped = {h for hs in hig.values() for h in hs}
    names = json.load(open(ROOT / "docs" / "_hig-names.json"))
    missing = []
    for group, titles in names.items():
        for t in titles:
            slug = t.lower().replace(" ", "-")
            if slug not in mapped:
                missing.append(f"[{t}]({HIG_URL}{slug})")
    missing_text = "、".join(missing)

    levels = "　".join(f"{k} {level_count[k]}" for k in ["原生", "桥接", "部分", "自绘", "不做"])
    x = "macos" if kit == "macos27" else "ios"
    text = TEMPLATE.format(
        title=f"{label} 组件登记表", kit=kit, label=label, x=x, levels=levels, n_pages=n_pages, n_pub=n_pub,
        n_solo=n_solo, n_var=n_var, n_int=n_int, mode_note=MODE_NOTE[kit], extra_nav=EXTRA_NAV[kit], heavy=heavy,
        inventory="\n".join(lines), token_pages="\n".join(token_lines), missing=missing_text,
        questions="\n".join(f"{i}. {q}" for i, q in enumerate(QUESTIONS[kit], 1)))
    out = OUT / ("macos-components.md" if kit == "macos27" else "ios-components.md")
    out.write_text(text, encoding="utf-8")
    print(f"{out.relative_to(ROOT)}: 页面 {n_pages} · 公开族 {n_pub} · 独立 {n_solo} · 变体 {n_var} · 内部件 {n_int}")

    # 实现登记表骨架：每个族、独立组件、内部件一行；令牌页一行
    rows = []
    for r in records:
        rows.append(f"### {r['page']}\n")
        rows.append(f"分类 `{r['bucket']}`　SwiftUI 对应：**{r['level']}**　{r['apis']}\n")
        rows.append("| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |\n|---|---|---|---|---|---|---|---|")
        for t, items in (("族", r["pub"]), ("独立", r["solo"]), ("内部件", r["internal"])):
            for it in items:
                st = "内部件" if t == "内部件" else "未开始"
                v = it.get("variants", "—")
                kind = t if t != "内部件" else ("内部件·族" if "variants" in it else "内部件·独立")
                rows.append(f"| {kind} | {esc(it['name'])} | `{it['id']}` | {v} | {st} |  |  |  |")
        rows.append("")
    rows.append("### 令牌页\n")
    rows.append("| 类型 | 名称 | nodeId | 变体 | 状态 | SwiftUI 实现 | 文件 | 备注 |\n|---|---|---|---|---|---|---|---|")
    for fn, keys, name, desc in TOKEN_PAGES:
        rows.append(f"| 令牌 | {name} | — | — | 未开始 |  |  | tokens/{fn} |")
    n_rows = sum(len(r["pub"]) + len(r["solo"]) + len(r["internal"]) for r in records) + len(TOKEN_PAGES)
    ex = NATIVE_EXTRA[kit]
    native_text = NATIVE_TEMPLATE.format(
        label=label, x=x, plat=ex["plat"], proj=ex["proj"], sdk=ex["sdk"], bridge=ex["bridge"],
        build_cmd=ex["build_cmd"], decided=ex["decided"], shell=NATIVE_SHELL[kit], levels=levels,
        n_pages=n_pages, n_pub=n_pub, n_solo=n_solo, n_var=n_var, n_int=n_int, rows=n_rows)
    nout = OUT / f"native-{x}-app.md"
    nout.write_text(native_text, encoding="utf-8")
    print(f"{nout.relative_to(ROOT)}: 登记行 {n_rows}")

    impl = ROOT / "native" / x / "IMPLEMENTATION.md"
    if impl.exists():
        print(f"{impl.relative_to(ROOT)}: 已存在，不覆盖")
    else:
        impl.parent.mkdir(parents=True, exist_ok=True)
        head = (f"# {label} 原生实现登记表\n\n> 骨架由 `tools/gen-docs.py` 首次生成，之后由开发 agent 维护，**脚本不再覆盖**。\n"
                f"> 需求见 [native-{x}-app.md](../../docs/native-{x}-app.md)，组件清单见 [{x}-components.md](../../docs/{x}-components.md)。\n"
                f"> {STATUS_LEGEND}每实现一个族就立即更新它的行；`无法实现` 必须写原因。\n\n")
        impl.write_text(head + "\n".join(rows) + "\n", encoding="utf-8")
        print(f"{impl.relative_to(ROOT)}: 已生成骨架 {n_rows} 行")


if __name__ == "__main__":
    OUT.mkdir(exist_ok=True)
    for k in (sys.argv[1:] or ["macos27", "ios27"]):
        build(k)
