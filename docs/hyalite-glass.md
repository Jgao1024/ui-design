# Liquid Glass 标准（hyalite）

网页原型里的 Liquid Glass 统一用这一套：VII-Cae/hyalite--liquid-glass v0.5.0（MIT）做实时折射，
参数是 2026-11-14 在两个实验台上逐个试过预设后定下的**标准档**（即"常规"）。
要找某个组件的玻璃画法，先到下面的页面里找。
下一步的计划（补全组件、json-render 玻璃版）见 [glass-gallery-next.md](glass-gallery-next.md)。

## 页面

构建：`./design/build.sh hyalite`。产物在 `design/pages/hyalite/`，用 Chrome 打开。

| 页面 | 用途 |
|---|---|
| `05-standard/standard.html` | **标准页**。iOS 和 macOS 全部组件，用标准参数，没有调节面板。单文件（约 1.3 MB），引擎、脚本、两张壁纸都内联，可以直接发给别人或传到手机 |
| `06-standard-macos/standard-macos.html` | 同上，只有 macOS 组件（约 1.2 MB） |
| `03-ios/components.html` | iOS 实验台：同样的组件，加参数面板、5 个预设、9 种底图、帧率测试 |
| `04-macos/components.html` | macOS 实验台，结构同上 |
| `02-home/home.html` | 豆包首页的 hyalite 版，带参数面板（还在用 hyalite 原版默认参数，不是标准档） |
| `01-edge-lab/edge-lab.html` | hyalite 官方剖面台的复刻，用来理解每个参数 |

### 组件清单

| iOS 27 | macOS 27 |
|---|---|
| 玻璃按钮（44 / 50 符号、Medium / Large 文字、Prominent） | 窗口与浮动侧边栏 |
| 工具栏（返回 + 按钮组） | 按钮（工具栏 36 高、67 x 24 按钮） |
| Tab Bar（Search Role） | 分段切换（工具栏玻璃 / 内容区实色） |
| 分段切换（常态 / 拖动中） | 搜索与文本框 |
| 开关（关 / 开 / 按住） | 下拉菜单 |
| 滑块（常态 / 拖动中） | 开关与复选框 |
| 搜索与输入框 | 滑块 |
| 下拉菜单 | Popover |
| Alert | Alert |
| Sheet | |

每页底部还有一个**底色矩阵**：同一组样本铺在白、浅灰、中灰、深灰、黑、彩色、照片、文字 8 种底上，
用来检查一套参数是不是在任何底上都能用。

## 标准参数

真源是 `design/system/hyalite/presets.ts` 里的 `GLASS_STANDARD`，iOS 和 macOS 共用。

| 参数 | 浅色 | 深色 | 含义 |
|---|---|---|---|
| shape | squircle | squircle | 倒角剖面 |
| bevel | 18 | 18 | 弯折带宽度，px（不会超过短边的一半） |
| thickness | 40 | 40 | 玻璃厚度，决定边缘往里拉多少 |
| slope | 0.9 | 0.9 | ≤ 1 不折叠，没有液态漩涡，边缘干净 |
| shade | 0.28 | 0.28 | 边缘压暗 |
| rim | 1.2 | 0.9 | 边缘反光 |
| edgeW | 6 | 6 | 明暗带宽度，px |
| sat | 1 | 1 | 边缘饱和度（1 = 不处理） |
| edge | 0.5 | 0.35 | CSS 外描边强度 |
| blur | 5 | 5 | 中心模糊，px |
| dispersion | 0.5 | 0.5 | 色散，px |
| light | -140 | -140 | 光向，度 |
| smooth | 1 | 1 | 抗锯齿二次位移的模糊，px |
| 填充 | 白 0.6 | 灰 26 · 0.65 | 填充灰度 · 透明度 |
| 阴影 | 0.1 | 0.35 | 投影透明度 |

## 在新页面里用

```tsx
import { Glass, GLASS_CSS } from "../../components/glass.tsx";

<Glass mode="light" width={44} height={44} radius={22}>…</Glass>
<Glass mode="dark" width={120} height={50} radius={25} tint="rgb(0 136 255 / 0.92)">完成</Glass>
```

- `mode` 决定这块玻璃用浅色还是深色那套参数；`tint` 用于 Prominent 这类有色玻璃。
- 页面要带上 `GLASS_CSS`，并在末尾用 `<Scripts driver="standard.js" />` 加载引擎和驱动，
  再写入 `window.HL_STANDARD`。照抄 `pages/05-standard/standard.tsx` 即可。
- 组件尺寸取自 Figma，现成的在 `design/system/hyalite/components/ios.tsx` 和 `macos.tsx`，
  新组件先在这两个文件里加，再放进标准页和实验台。

## 浏览器支持

| 环境 | 效果 |
|---|---|
| 电脑上的 Chrome / Edge / Arc，安卓上的 Chrome | 完整折射 |
| Safari，以及 iPhone / iPad 上的所有浏览器（都是 WebKit） | 只有模糊和填充，没有折射；标准页顶部会显示提示 |
| Firefox | 只有模糊 |

## 性能

页面不动时几乎没有开销；开销只在玻璃下面的内容变化（滚动、动画）时出现。
实测（M2，headless Chrome，没有 GPU 加速，数字偏保守）：

| 预设 | iOS 实验台 84 个玻璃 | macOS 实验台 78 个玻璃 |
|---|---|---|
| 标准（常规） | 15 fps | 17 fps |
| 性能档 | 60 fps | 60 fps |

两档肉眼几乎看不出差别。主要开销来自色散（`dispersion` > 0 会把位移拆成 R、G、B 三次）和抗锯齿二次位移
（`slope` ≤ 1 且 `smooth` > 0 时开启）。如果做的是会滚动、同时有很多玻璃的页面，把这两项设为 0。
实验台面板里的"动画测试 3 秒"能看到当前浏览器的真实帧率。

## 改标准

1. 在实验台上调好，点"定为标准（复制 JSON）"。
2. 把 JSON 里的值写进 `presets.ts` 的 `GLASS_STANDARD`。
3. `./design/build.sh hyalite`，标准页和两个实验台的"回到标准"都会更新。

## 文件

```
design/system/hyalite/
  vendor/hyalite.js       引擎，原样引入（MIT © 2026 VII-Cae (VII)）
  presets.ts              5 个预设 + GLASS_STANDARD
  components/glass.tsx    Glass 组件和它的 CSS
  components/ios.tsx      iOS 组件        components/macos.tsx   macOS 组件
  components/lab.tsx      实验台：面板、底图、舞台、底色矩阵
  client/*.js             各页面的浏览器端驱动（构建时内联）
  pages/                  01-edge-lab  02-home  03-ios  04-macos  05-standard  06-standard-macos
  components/standard.tsx 两个标准页共用的排版和照片内联
```

- 这个 kit 是唯一允许产物带 JS 的（`design/system/build.ts` 的 `SCRIPTED_KITS`），其他 kit 仍然是零 JS。
- 照片底用的是本机系统壁纸，放在 `design/.ref/wallpapers/`（已 gitignore，不入库）。换一台 Mac 要重新生成：

```bash
mkdir -p design/.ref/wallpapers
sips -s format jpeg -s formatOptions 80 -Z 1600 /System/Library/Wallpapers/.default/DefaultAerial.heic --out design/.ref/wallpapers/aerial.jpg
sips -s format jpeg -s formatOptions 80 -Z 1600 "/System/Library/Desktop Pictures/.wallpapers/Sonoma Horizon/Sonoma Horizon.heic" --out design/.ref/wallpapers/sonoma.jpg
```

  缺这两张图时照片格退回纯色，其他不受影响。
