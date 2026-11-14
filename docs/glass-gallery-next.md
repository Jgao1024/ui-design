# 下一步：补全组件 + json-render 玻璃版（调研与方案）

2026-11-14 整理。这份文档是下一个会话的工作说明：调研结论、已经定下的决策、现有代码怎么用、
要做的三份 HTML 各包含什么、怎么验收。先读 [hyalite-glass.md](hyalite-glass.md)，那里有标准参数和现有页面。

## 1. 产出

三份**单文件** HTML，都用标准玻璃参数，没有调节面板，引擎、脚本、壁纸全部内联，可以直接发到手机上：

| 文件（`design/pages/hyalite/` 下） | 内容 |
|---|---|
| `07-ios-more/ios-more.html` | iOS 27 其余组件（§5） |
| `08-macos-more/macos-more.html` | macOS 27 其余组件（§6） |
| `09-json-render/json-render.html` | json-render 全部官方组件 + 扩展的多模态组件 + 3 个 AI 聊天整屏示例 + 粘贴 JSON 实时预览（§4） |

源码对应 `design/system/hyalite/pages/07-ios-more/ios-more.tsx` 等，构建命令 `./design/build.sh hyalite`。

## 2. 已定决策（用户全部选"是"）

1. 渲染器是一份浏览器 JS：输入 json-render 的 spec JSON，输出玻璃风格的 HTML。同一份代码既在构建时生成静态展示，
   也内联进页面做"粘贴 JSON 实时预览"。
2. 官方组件全部覆盖，**props 名照抄官方**，让模型现有输出不改就能渲染；另外扩展约 15 个多模态组件（§4.4），
   并写出 props 说明，方便用户加进自己的 catalog。
3. 玻璃只用在容器和浮层上（Card、Dialog、Drawer、Popover、Tooltip、DropdownMenu、Button、Tabs 等）；
   文字、表格、图表画在玻璃卡片里面，用实色。
4. 每个组件左边是 JSON，右边是渲染结果，浅色和深色都画；另做 3 个 AI 聊天整屏示例：数据分析回答、行程规划、
   多模态（图片 + 文件）回答。
5. 交互：预览里 Tabs、Accordion、Collapsible、Switch、Checkbox、Select、Slider 可以操作；`$state` 读取、
   `$bindState` 双向绑定、`visible`、`repeat`、`$cond`、`$template` 都支持；actions（`on.press` 等）不执行，只画出按钮。
6. iOS 和 macOS 的补充组件也做（§5、§6）。三份产出互相独立。

## 3. 现有基础（必须遵守）

### 不能动的东西

- `01-edge-lab` 到 `06-standard-macos` 六个页面，以及 ios27 / macos27 / doubao 三个 kit：**一个字节都不能变**。
  动手前先记哈希，构建后对比：

  ```bash
  cd design && find pages -name '*.html' -exec shasum {} + | sort -k2 > /tmp/before.sha
  ./build.sh && find pages -name '*.html' -exec shasum {} + | sort -k2 | diff /tmp/before.sha - | grep -v -E '0[789]-'
  ```

- 可以**新增**文件；修改共享文件（`components/glass.tsx`、`lab.tsx`、`ios.tsx`、`macos.tsx`、`presets.ts`、
  `client/*.js`）时，只能做"不改变现有产物"的改动（加可选参数、加新导出），并用哈希验证。
- 只读引用其他 kit（`design/system/ios27`、`macos27`、`doubao`）的图标和尺寸，不改它们。

### 可以直接用的

| 文件 | 用途 |
|---|---|
| `components/gallery.tsx` | **为这次新建、还没用过、没构建验证过**的页面骨架：`GalleryPage({ title, subtitle, sections })`，每个 item 浅色 / 深色并排，`bg` 可选 9 种底或 `"plain"`（白 / 黑应用底），手机上自动单列并按宽度缩放；照片内联、标准参数、驱动都已接好。三份产出都用它（json-render 页可能要扩展：左边 JSON、右边渲染） |
| `components/glass.tsx` | `<Glass mode width height radius tint? class? style?>`。浏览器端动态生成的玻璃写成 `<div class="hl-glass" data-mode="light" style="width;height;border-radius">` 效果一样 |
| `components/lab.tsx` | `Stage`（背景舞台，`bg` 取 `BACKGROUNDS` 的 id）、`BACKGROUNDS` |
| `components/ios.tsx` / `macos.tsx` | 现有组件，新组件可以复用其中的 `SymbolButton`、`TextButton` 等（导出已有的） |
| `client/standard.js` | 页面加载时把标准参数挂到所有 `.hl-glass` 上。**只在加载时跑一次**；实时预览重新渲染后要对新玻璃调用 `Hyalite.attach(el, opts)`，对移除的调用 `Hyalite.detach(el)`，需要新写一个驱动或扩展（不能改变 05/06 的产物） |
| `components/script.tsx` | `<Scripts driver="xxx.js" />` 内联引擎 + 驱动；代码里不能出现 `</script` |
| `presets.ts` | `STANDARD.ios` / `STANDARD.macos`（同一套） |
| 图标 | `design/system/ios27/components/icon.tsx`、`design/system/macos27/components/icons.tsx`、`design/system/doubao/components/icons.tsx`；缺的图标在新文件里自己画 SVG |

### 技术约束

- 只有 Chromium 能看到折射；iPhone 上所有浏览器都是 WebKit，只剩模糊（页面顶部会自动出提示）。
- Tailwind 只给**构建时**出现在 markup 里的 class 生成 CSS。json-render 渲染器在浏览器里生成的 HTML 不能依赖
  Tailwind class，要用渲染器自己的一份 CSS（`<style>` 内联，class 加前缀，例如 `jr-`）。
- 性能：色散和抗锯齿二次位移是主要开销。一页上玻璃很多时注意帧率；标准参数下 84 个玻璃同时动约 15 fps
  （headless、无 GPU）。静态页面不受影响。
- 构建产物不入库（`design/pages/` 已 gitignore）。下载走代理 `http://127.0.0.1:7897`。

## 4. json-render 调研

仓库：[vercel-labs/json-render](https://github.com/vercel-labs/json-render)，Apache-2.0，19.6k★，2026-11-14 仍在更新。
官网 <https://json-render.dev/>。源码已存到本机 `design/.ref/json-render/`（gitignore）：
`jr-shadcn.ts`（官方 shadcn 组件目录）、`jr-chat-catalog.ts`（聊天示例目录）、`jr-schemas.mdx`、
`jr-data-binding.mdx`、`visibility.mdx`、`computed-values.mdx`、`jr-catalog.mdx`。有疑问以这些源文件为准。

### 4.1 Spec 格式

模型输出一个扁平的元素表：

```json
{
  "root": "card-1",
  "elements": {
    "card-1": { "type": "Card", "props": { "title": "Dashboard" }, "children": ["text-1", "button-1"] },
    "text-1": { "type": "Text", "props": { "text": { "$state": "/user/name" } }, "children": [] },
    "button-1": { "type": "Button", "props": { "label": "Click me" }, "children": [] }
  },
  "state": { "user": { "name": "Jgao" } }
}
```

元素字段：`type`、`props`、`children`（子元素 id 数组）、可选 `visible`、`repeat`、`on`（事件 → action）。

### 4.2 表达式（props 里任意位置）

| 表达式 | 写法 | 用途 |
|---|---|---|
| `$state` | `{ "$state": "/path" }` | 读 state（JSON Pointer） |
| `$item` / `$index` | `{ "$item": "field" }` / `{ "$index": true }` | repeat 内读当前项 / 序号 |
| `$bindState` / `$bindItem` | `{ "$bindState": "/path" }` | 表单双向绑定（value、checked、pressed） |
| `$cond` | `{ "$cond": 条件, "$then": a, "$else": b }` | 条件取值 |
| `$template` | `{ "$template": "Hi ${/user/name}" }` | 字符串插值 |
| `$computed` | `{ "$computed": "fn", "args": {} }` | 需注册函数，**不实现**，原样显示占位 |

- `repeat`：元素上的顶层字段 `{ "statePath": "/todos", "key": "id" }`，对数组每项渲染一次 children。
- `visible`：`{ "$state": "/x" }` 为真即显示；可加 `"not": true`、`"eq"`、`"neq"`、`"gt"`、`"gte"`、`"lt"`、`"lte"`，
  比较值本身也可以是 `{ "$state": ... }`。

### 4.3 官方组件（全部要做，props 照抄）

**shadcn 目录（36 个，`jr-shadcn.ts`）**

| 组件 | props（`?` = nullable） | 子元素 |
|---|---|---|
| Card | title?, description?, maxWidth?(sm/md/lg/full), centered? | 有 |
| Stack | direction?(horizontal/vertical), gap?(none/sm/md/lg/xl), align?(start/center/end/stretch), justify?(start/center/end/between/around) | 有 |
| Grid | columns, gap?(sm/md/lg/xl) | 有 |
| Separator | orientation?(horizontal/vertical) | |
| Tabs | tabs[{label,value}], defaultValue?, value? | 有 |
| Accordion | items[{title,content}], type?(single/multiple) | |
| Collapsible | title, defaultOpen? | 有 |
| Dialog | title, description?, openPath | 有 |
| Drawer | title, description?, openPath | 有 |
| Carousel | items[{title?,description?}] | |
| Table | columns: string[], rows: string[][], caption? | |
| Heading | text, level?(h1–h4) | |
| Text | text, variant?(body/caption/muted/lead/code) | |
| Image | src?, alt, width?, height?（无 src 画占位） | |
| Avatar | src?, name, size?(sm/md/lg) | |
| Badge | text, variant?(default/secondary/destructive/outline) | |
| Alert | title, message?, type?(info/success/warning/error) | |
| Progress | value, max?, label? | |
| Skeleton | width?, height?, rounded? | |
| Spinner | size?(sm/md/lg), label? | |
| Tooltip | content, text | |
| Popover | trigger, content | |
| Input | label, name, type?(text/email/password/number), placeholder?, value? | |
| Textarea | label, name, placeholder?, rows?, value? | |
| Select | label, name, options: string[], placeholder?, value? | |
| Checkbox | label, name, checked? | |
| Radio | label, name, options: string[], value? | |
| Switch | label, name, checked? | |
| Slider | label?, min?, max?, step?, value? | |
| Button | label, variant?(primary/secondary/danger), disabled? | |
| Link | label, href | |
| DropdownMenu | label, items[{label,value}], value? | |
| Toggle | label, pressed?, variant?(default/outline) | |
| ToggleGroup | items[{label,value}], type?(single/multiple), value? | |
| ButtonGroup | buttons[{label,value}], selected? | |
| Pagination | totalPages, page? | |

表单组件还有 `checks`、`validateOn`（校验），渲染时忽略即可。Dialog / Drawer 在展示页里画成打开状态。

**聊天示例目录（`jr-chat-catalog.ts`，和上表重名的以这里的 props 为准，两套都要兼容）**

| 组件 | props |
|---|---|
| Text | content, muted? |
| Metric | label, value, detail?, trend?(up/down/neutral) |
| Table | data: object[], columns[{key,label}], emptyMessage? |
| Link | text, href |
| BarChart | title?, data: object[], xKey, yKey, aggregate?(sum/count/avg), color?, height? |
| LineChart | 同 BarChart |
| PieChart | title?, data: object[], nameKey, valueKey, height? |
| Tabs | defaultValue?, tabs[{value,label}]；子元素是 TabContent |
| TabContent | value |
| Callout | type?(info/tip/warning/important), title?, content |
| Timeline | items[{title,description?,date?,status?(completed/current/upcoming)}] |
| RadioGroup | label?, value?, options[{value,label}] |
| SelectInput | label?, value?, placeholder?, options[{value,label}] |
| TextInput | label?, value?, placeholder?, type?(text/email/number/password/url) |
| Button | label, variant?(default/secondary/destructive/outline/ghost), size?(default/sm/lg), disabled? |

同目录里的 Box、Sphere、Cylinder、Cone、Torus、Plane、Ring、各种 Light、Stars 是 react-three-fiber 的 3D 组件，
**不做**，渲染器遇到时画一个"3D 场景（未支持）"占位卡。遇到任何未知 type 也画占位卡并显示 type 名。

两套里 Text（text / content）、Link（label / text）、Table（columns 是字符串或对象、rows 或 data）、
Button 的 variant 写法不同：渲染器按"有哪个字段就用哪个"兼容。

### 4.4 扩展的多模态组件（官方没有，props 自定）

| 组件 | props |
|---|---|
| CodeBlock | language, code, filename? |
| Markdown | content（支持标题、粗斜体、列表、引用、行内代码、链接、表格） |
| AreaChart | 同 LineChart |
| DonutChart | 同 PieChart，加 centerLabel? |
| Heatmap | title?, rows: string[], columns: string[], values: number[][] |
| ImageGrid | images[{src?,alt}], columns?（无 src 用渐变占位） |
| FileCard | name, size?, kind?(pdf/doc/xls/ppt/zip/image/audio/video/other), pages? |
| AudioMessage | duration, transcript?, waveform?: number[] |
| VideoCard | title, duration?, poster? |
| MapCard | title, address?, distance?, eta? |
| WeatherCard | city, temp, condition(sunny/cloudy/rain/snow/storm), high?, low?, hourly?[{time,temp,condition}] |
| Sources | items[{title,site,url?}] |
| ToolSteps | steps[{label,status(done/running/pending/error),detail?}] |
| FollowUps | items: string[]（追问建议胶囊） |
| Streaming | text, cursor?（生成中：闪烁光标 + 骨架行） |

图表全部用渲染器自己画的 SVG，不引第三方图表库。

### 4.5 页面结构

1. 顶部：粘贴 JSON 的实时预览区（textarea + 浅色 / 深色渲染结果并排；预置几个示例可一键填入；
   JSON 解析失败时显示错误位置）。
2. 官方组件：每个组件一个 item，左边 spec JSON（等宽、可读），右边渲染。
3. 扩展组件：同上，并附 props 说明表。
4. 3 个 AI 聊天整屏示例：手机宽度（393 pt）的对话界面，玻璃输入栏，回答由 spec 渲染。

## 5. iOS 27 其余组件（`07-ios-more`）

已有的（在 05 标准页里）：玻璃按钮、工具栏、Tab Bar、分段、开关、滑块、搜索与输入、下拉菜单、Alert、Sheet。
这次补：

| 组 | 组件 |
|---|---|
| 导航 | 大标题导航栏（滚动前 / 滚动后变小标题）、底部工具栏（48 pt 按钮）、页面指示器胶囊 |
| 浮层 | 上下文菜单（长按预览 + 菜单）、操作表 Action Sheet、编辑菜单（拷贝 / 粘贴胶囊）、Popover（iPad）、分享面板 |
| 系统 | 通知横幅与展开通知、锁屏（时间 + 小组件）、主屏小组件（小 / 中）、控制中心模块、灵动岛（紧凑 / 展开）、Toast / HUD |
| 媒体 | 迷你播放器、全屏播放器控件 |
| 输入 | 滚轮选择器、日期选择（日历）、Stepper、键盘配件栏、搜索建议与 Token |
| 列表 | Inset Grouped 列表在玻璃 Sheet 里、滑动操作行 |

几何参考 `design/system/ios27/components/*.tsx` 文件头的注释（数值来自 Figma），可以只读引用。

## 6. macOS 27 其余组件（`08-macos-more`）

已有的（在 06 页里）：窗口与侧边栏、按钮、分段、搜索与文本框、下拉菜单、开关与复选框、滑块、Popover、Alert。
这次补：

| 组 | 组件 |
|---|---|
| 系统 | 菜单栏（含状态项）、Dock（含放大和运行指示点）、控制中心、通知横幅与通知中心、Spotlight、音量 / 亮度 HUD、桌面小组件 |
| 窗口 | 完整工具栏（多组按钮 + 弹出按钮 + 搜索）、窗口标签页、检查器面板、Sheet（从标题栏落下）、工具面板 |
| 菜单 | 右键菜单 + 子菜单、Tooltip |
| 数据 | 表格（列头、斑马纹、选中行）、日期选择器（日历）、Stepper 与日期字段、进度条 / 圆形进度 / Spinner |

几何参考 `design/system/macos27/components/*.tsx` 文件头的注释，可以只读引用。

## 7. 验收

1. `./design/build.sh hyalite` 无报错；全量 `./design/build.sh` 后，除 07 / 08 / 09 外所有页面哈希不变（§3 的命令）。
2. 三个产物没有外部引用：

   ```bash
   grep -oE '(src|href)="[^"#d][^"]*"|url\((&quot;|")?\.\.[^)]*' design/pages/hyalite/0[789]*/*.html
   ```

   只允许指向 `https://` 的普通链接。
3. 截图逐区检查（浅色 / 深色、照片底 / 白底 / 黑底），文字不重叠、玻璃有折射。
4. 手机视口检查：用 CDP 模拟 393 宽 mobile 视口（桌面 headless 窗口有最小宽度，截图不准），
   确认 `document.documentElement.scrollWidth === innerWidth`，没有横向溢出。
5. json-render 页：把 §4.1 的例子和官方 catalog 里每个组件的 `example` 粘进预览区都能渲染；
   乱写一个 type 显示占位卡；JSON 写错显示错误而不是白屏。
6. 在 `docs/hyalite-glass.md` 的页面表里补上三个新页面，组件清单补全。

### 工具脚本

上一个会话用过的脚本存在 `design/.ref/hyalite-tools/`（路径写死了 `/tmp/hyalite/`，用前先 `mkdir -p /tmp/hyalite` 或改路径）：

| 脚本 | 用途 |
|---|---|
| `preset-shot.sh` | 注入点击后用 headless Chrome 截整页 |
| `wide.ts` | Deno + CDP：手机视口下查横向溢出、截图（`design/.bin/deno run -A wide.ts`） |
| `bench.ts` / `cdp.ts` | Deno + CDP：测帧率 |
