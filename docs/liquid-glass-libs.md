# Liquid Glass 开源复刻：调研与选型（2026-11-14）

搜了 GitHub 上 7704 个含 "liquid glass" 的仓库（按 star 排序），通读 8 个的实现，并在本机 Chrome 157 里
跑了条纹折射测试。结论按"像不像"和"能不能进你的静态原型流水线"两条轴分开给。

---

## 0. 结论

- **材质最像：`VII-Cae/hyalite--liquid-glass`**（270★, MIT, 单文件 51 KB）。SDF 圆角矩形 → Snell 折射 →
  一张 `feDisplacementMap` 贴图。它的 demo 在 Chrome 157 里边缘网格是真的弯的，中心是清的，沿边有一道
  1px 镜面线。只做"玻璃"这一件事，不含组件。
- **控件最像：`0kzh/glisse`**（535★, MIT, npm `glisse@0.6`）。Button / Switch / Tab Bar / Segmented /
  Menu / Search / Slider / Glass 八个 iOS 控件，形状、状态、rim 光都对着 iOS 26 量过；它过滤的是**内容**
  而不是背景，所以 Safari 也弯。
- **星最多但别直接用：`rdev/liquid-glass-react`**（6693★, MIT）。2025-06 停更，README 自己写
  "Safari 和 Firefox 只部分支持（位移不可见）"，实际观感是磨砂塑料加一圈白边，不是玻璃砖。
- **你自己那套方向是对的**：`design/system/components/glass.tsx` 已经是 backdrop-filter + SVG 位移贴图，
  和 hyalite 同一条技术路线。差距不在框架，在**贴图的场**：现在是 x、y 两条线性渐变（可分离），圆角处
  的法线是错的，所以角上不弯、只糊；换成 SDF 法线场就到位了。

---

## 1. 怎么算"像"（5 条判据）

Apple 的 Liquid Glass 是 lensing（弯折）+ highlight（镜面线）+ shadow（自适应阴影）+ tint（吸收背景色）
四层，不是 `blur(20px)` 加 1px 白边。网上九成复刻只做到一半。

| # | 判据 | 不合格的样子 |
|---|------|--------------|
| 1 | 边缘有位移，直线在里面会弯；中心是中性 128 | 只有模糊，直线穿过去不弯 |
| 2 | 位移方向沿圆角矩形法线，角上是斜的 | 可分离的 x/y 斜坡：只有四条边弯，角上糊 |
| 3 | 位移在**最外沿**最大、往里衰减 | 峰值在中间 = 果冻滤镜感 |
| 4 | 镜面线贴在 rim 上，宽 1–2px，只出现在受光侧 | 整圈均匀的一道白边 |
| 5 | tint 随背景亮度走（黑底会被抬亮） | 固定 55% 白，黑底上发灰、白底上发糊 |

五条全过的，这一轮只找到 4 个项目（下面 §2 的 A 组）。

---

## 2. 候选总表

### A. 真做了折射（能过 ≥3 条）

| 仓库 | ★ | 许可 | 最近提交 | 技术 | 适配度 |
|---|---|---|---|---|---|
| [VII-Cae/hyalite--liquid-glass](https://github.com/VII-Cae/hyalite--liquid-glass) | 270 | MIT | 2026-09-11 | SDF + Snell + canvas PNG 贴图，单文件 51 KB，无构建 | ★★★★★ 贴图数学可直接抄 |
| [0kzh/glisse](https://github.com/0kzh/glisse) | 535 | MIT | 2026-11-13 | 过滤内容（不是背景），React 组件 + CSS 变量 | ★★★★☆ 控件形状/状态参考 |
| [samasante/liquid-glass](https://github.com/samasante/liquid-glass) | 674 | MIT | 2026-06-23 | headless React lens，折射实时 DOM；跨浏览器要传背景副本 | ★★★☆☆ 思路对，React 重 |
| [shuding/liquid-glass](https://github.com/shuding/liquid-glass) | 1231 | MIT | 2026-03-26 | 最小 SVG shader（feImage 贴图 + backdrop-filter），console 粘贴即用 | ★★★☆☆ 最小可抄样例 |
| [sohumsuthar/liquid-glass](https://github.com/sohumsuthar/liquid-glass) | 3 | MIT | 2026-08-28 | 对着 macOS 26 Control Center 标定传递曲线 + 光线追踪 | ★★★☆☆ 抄参数，不抄代码 |
| [crenspire/glass-ui](https://github.com/crenspire/glass-ui) | 104 | **无** | 2026-10-14 | 49 个 shadcn 组件，WebGL 折射 + CSS 回退 | ★★☆☆☆ 无许可证，不可复制 |

### B. 星多但不是你想的那种

| 仓库 | ★ | 问题 |
|---|---|---|
| [rdev/liquid-glass-react](https://github.com/rdev/liquid-glass-react) | 6693 | 2025-06 停更；Safari/Firefox 不弯；观感偏磨砂 |
| [AndrewPrifer/liquid-dom](https://github.com/AndrewPrifer/liquid-dom) | 2593 | WebGPU + 需要 Chrome 的 canvas-draw-element flag，浏览器里跑不起来 |
| [iyinchao/liquid-glass-studio](https://github.com/iyinchao/liquid-glass-studio) | 829 | WebGL2/WebGPU，重；适合做 demo 不适合做页面 |
| [naughtyduk/liquidGL](https://github.com/naughtyduk/liquidGL) | 1066 | license 是 NOASSERTION，等于不可用 |
| [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | 1784 | WebGL + html2canvas 截图采样，真折射但内容被定格；2025-06 停更 |
| [callstack/liquid-glass](https://github.com/callstack/liquid-glass) | 1733 | React Native 原生桥，web 用不上 |

---

## 3. 前四名点评

### hyalite（最像，推荐抄）

- 对每个元素按**真实尺寸和四个圆角半径**算一张 SDF 贴图：法线方向决定位移方向，Snell 折射决定位移量，
  中心保持 128，沿边按 `bevel` 宽度衰减，外加一道 caustic 明暗和一个 rim 高光。
- 支持不等宽圆角、椭圆角、胶囊（半径超过短边一半）、元素 resize 时重建贴图——这几点你的 Figma 参数
  也用得上（Regular 34 / Clear 23 / capsule 1000）。
- 有 headless Chromium 自测脚本 `demo/run-cases.mjs`，`npm test` 直接跑，可以当移植后的回归基线。
- 缺点：只认 Chromium（`url()` 在 backdrop-filter 里），Safari/Firefox 退化成 CSS 的 blur；
  仓库命名带 `--`，npm 上不好找，只能 vendored 或直接抄源码（MIT，抄要留版权声明）。

### glisse（控件形状最像）

- 渲染思路和所有人都不一样：**把玻璃下面的内容本身做位移**，玻璃位置只放一张遮罩，所以不需要
  backdrop-filter 的 url()，Safari 也能真弯。
- 代价：镜头一移动就要重绘整块内容的滤镜，Safari 在 1200×800@2x 上约 40 ms/帧；静态画面零成本。
- 组件层的完成度是这批里最高的：Tab Bar、Switch、Segmented、Search、Slider 的手感/状态/rim 光都有；
  MIT，可以直接读代码量参数。

### samasante（跨浏览器的正解，但重）

- 统一 API，内部三种引擎：Chrome 走 backdrop-filter 实时弯，Safari/Firefox 需要你交一份背景副本
  （图片/视频/节点），它把副本弯给你看。
- 对静态原型其实很合适：壁纸是固定的，副本等于白送。但对滚动内容不成立。

### sohumsuthar（参数最可信）

- 唯一一个声称"对着 macOS 26 Control Center 量过"的：压缩抬升曲线 `L ≈ 0.58·L + 34`、rim 亮度分布、
  Snell 的 IOR ≈ 1.5168。只有 3 星，代码没人维护，但**参数表值得抄**。
- 同类的 `crenspire/glass-ui` 有 49 个现成组件，但仓库没有 LICENSE，等于不能复制代码，只能看形状。

---

## 4. 对你项目的适配结论

你的流水线是"TSX → 零 JS 单文件 HTML → Chrome headless 截图"，这决定了三件事：

1. **只有构建期算好、HTML 里写死的方案能进。** 运行时 JS 的库（rdev/glisse/samasante/liquid-dom）都得
   改成"把它们的数学搬进 `glass.tsx`"，不能直接依赖。
2. **Chrome 是唯一会真弯的浏览器。** `backdrop-filter: url(#filter)` 只有 Chromium 认；Safari 把整条声明
   丢掉（连带同一条里的 blur，`-webkit-` 别名能把只含 blur 的那条留下来），Firefox 从来不做。你的
   `shot.sh` 用 Chrome，所以截图有效；但 Safari 里打开同一页会退化成今天的样子。兜底要另写一条只含
   blur 的声明，且注意 Safari 可能"解析了但什么都不做"，单靠 `@supports` 不够。
3. **Figma 那套数值不用动。** fill / rim / inner shadow / drop shadow / 半径全部保留，只换两处：
   贴图的场（线性斜坡 → SDF 法线场）和多一层 rim 高光。

### 贴图这层的现状

`glass.tsx` 里的 `displacementMap()` 是两条线性渐变：

- 左缘 R=255、中间 128、右缘 R=0；上缘 G=255、中间 128、下缘 G=0。
- 这在四条直边上是**对的**（位移指向内侧），在圆角上是**错的**：真玻璃在角上的法线是 45°，可分离
  渐变给的是"同时向左和向上"，角上就被拉成斜向的糊块。160×160、radius 34 的 Regular 上，这个
  差异肉眼可见。
- 另外内阴影用了三组 `inset`，但没有沿 rim 的 1px 高光；Apple 的高光只出现在受光侧，不是整圈。

---

## 5. 三条落地路线

### A. 换贴图（推荐，约 60–90 分钟）

把 hyalite 的 `buildMap()`（`hyalite.js` 第 258 行起，约 120 行，纯数学）搬进 `glass.tsx`，在构建期
生成 RGB 贴图：R/G = 位移方向，B = 边缘明暗，128 为中性。

- 构建期没有 canvas，用 `CompressionStream('deflate')` 手写 PNG（约 60 行），输出
  `data:image/png;base64,…`。
- 滤镜的写法**必须**是下面这个形状，否则 Chrome 会把贴图本身画出来而不是弯背景（我实测过三个变体）：

```html
<filter id="f" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse"
        x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
  <feImage preserveAspectRatio="none" result="map" href="data:image/png;base64,…"/>
  <feDisplacementMap in="SourceGraphic" in2="map" scale="-80"
                     xChannelSelector="R" yChannelSelector="G"/>
</filter>
```

关键点：区域用 `objectBoundingBox` 的 1×1；`feImage` **不写** width/height（填满区域）；`primitiveUnits`
留 `userSpaceOnUse`（scale 是像素）；`scale` 取负 = 向内采样 = 凸透镜放大；`sRGB` 必写，linearRGB 会让
128 漂移、整块背景平移。

- 保留现有 fill/rim/shadow，另加一层 `box-shadow: inset 0 1px 0 rgb(255 255 255 / .55)` 只在上缘。

### B. 背景复制层（Safari 也弯，约 2–3 小时/页）

玻璃里放一份壁纸副本，用 `filter: url(#…)` 弯副本，再用 `mask` 裁成玻璃形状。静态原型里壁纸是固定的，
坐标可算，效果是所有方案里最接近真机的（samasante 的 copy 模式、courtsimas/glass-lens 都是这个路子）。
缺点：不适合滚动内容，每页要单独对齐。

### C. 引 glisse（不建议）

组件完成度最高，但它是 React 运行时 + 自己的 CSS 变量体系，和"零 JS 单文件 HTML"直接冲突，
等于给原型系统换引擎。只建议当形状/状态参考，不装。

---

## 6. 实测记录（Chrome 157.0.8103.78，macOS，headless）

| 测试 | 结果 |
|---|---|
| `backdrop-filter: blur(12px)` | 正常 |
| `backdrop-filter: url(#f)`，f = feTurbulence + feDisplacementMap | 正常，背景条纹被弯 |
| `backdrop-filter: url(#f)`，f = feImage(贴图, 指定 width/height) + feDisplacementMap | **异常**：把贴图本身画了出来（出现红/绿色块），背景不弯 |
| 同上的元素滤镜 `filter: url(#f)` | 同样异常，说明不是 backdrop 特有 |
| hyalite 的构造（objectBoundingBox 1×1 + feImage 不写尺寸 + href/xlink:href 双写） | 正常，边缘有位移，中心中性 |
| hyalite 官方 demo（GitHub Pages） | 正常，卡片边缘网格明显弯折 |
| 你的构建产物 + 把壁纸换成条纹后重渲染 | blur 生效，条纹**只是变糊、相位不变**，没有 lensing；换滤镜区域/单位再渲染，结果一字不差 |
| 换成 SDF 贴图（`design/system/doubao/components/lens.tsx`） | 正常：2× 放大下能看清圆角处条纹被拉弯、相位错开 |

结论：**技术可行；你缺的是贴图的"场"，不是滤镜写法**。`glass.tsx` 用 x/y 两条线性渐变，
效果是整块背景被横向/纵向拉伸，圆角处没有法线，所以条纹只是糊。换成 SDF 法线场
（`lens.tsx` 里已写好，构建期生成 PNG，页面仍然零 JS）之后，折射在 Chrome 里可见。
滤镜构造仍有坑：`filterUnits` 用 objectBoundingBox 的 1×1、`feImage` 不写 width/height、
区域和 `crop` 别手工相加——写错就会从"弯"变成"贴图被当内容画出来"。

---

## 7. 验收清单（移植后逐条过）

0. 先把现在的 `Glass` 单独丢进一张条纹页跑一遍（约 5 分钟）：壁纸换 `repeating-linear-gradient(90deg,#111 0 40px,#fff 40px 80px)`，
   看条纹在玻璃里是弯的、还是直接穿过去。这是唯一能一眼判断"有没有折射"的测试背景——渐变和照片都会骗人。
1. 玻璃里的条纹必须在**最外沿**明显弯、中心保持直。
2. 圆角处（半径 34）的法线是斜的：条纹在角上要跟着转，而不是同时被推向左和上。
3. 四个圆角半径不等时（如 `24 24 0 0`）不能塌。
4. 160×160 和 48×48 的胶囊用同一套参数，位移量要按短边收敛，不然小胶囊会糊成一团。
5. Safari 打开同一页：不应出现"整条 backdrop-filter 失效导致透明"的回归，兜底要给 blur + tint。
6. 截图对比：同一页 Chrome 截图 vs 系统设置里 `glassEffect` 的截图，看 rim 高光宽度是否 1–2px。

---

## 8. 链接

- hyalite：<https://github.com/VII-Cae/hyalite--liquid-glass> · demo <https://vii-cae.github.io/hyalite--liquid-glass/demo/index.html>
- glisse：<https://github.com/0kzh/glisse> · <https://glisse.kelvinzhang.ca>
- samasante：<https://github.com/samasante/liquid-glass>
- sohumsuthar：<https://github.com/sohumsuthar/liquid-glass>
- rdev：<https://github.com/rdev/liquid-glass-react>
- 一份讲清"路径分几类、各自在哪个浏览器成立"的综述：<https://github.com/reatom/reatom/blob/main/examples/gallery/docs/liquid-glass-web.md>
- Apple 官方口径：WWDC25 *Meet Liquid Glass*（219）与 *Adopting Liquid Glass*
