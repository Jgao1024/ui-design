# ui-design

Apple 原生设计语言仓库。参考层从 Apple 官方 **macOS 27 / iOS 27 UI Kit** 抽取，
参数、颜色、字体、材质全部保留，可离线查询，不需要再访问 Figma。

## 目录

```
Figma/                        ← Figma 抓取的全部素材与工具
figma/reference/
  _raw/                      ← 原始数据（完整、未裁剪，勿删）
    macos27-file.json        Figma 完整文档树 43 MB
    ios27-file.json          Figma 完整文档树 49 MB
    *-components.json        /components 探测结果（空：社区副本无 library 组件）
  macos27/  ios27/
    specs/<分类>/*.json      每个组件一个文件：几何、颜色、字体、效果、变体
    svg/<分类>/*.svg         每个组件的矢量导出（插件桥写入）
    tokens/colors.json       全部纯色 + 渐变（hex / alpha / 使用次数 / 用在哪）
    tokens/typography.json   全部文字样式（字体、字重、字号、行高、字距）
    tokens/effects.json      全部效果 —— BACKGROUND_BLUR 就是 Liquid Glass 材质层
    tokens/geometry.json     圆角、auto-layout 间距、组件尺寸分布
    MANIFEST.json            组件 → 文件 映射
    index.md                 人读索引
  CATALOG.md                 跨平台总表：组件 → SVG → 参数（636 行）
  catalog.json               同一份数据的机器可读版
figma/tools/figma-pull/
  pull.py                    Figma REST 拉取（带缓存，绝不重复计费）
  extract.py                 从缓存的原始树抽取 specs + tokens
  receiver.py                本机接收器：收插件发来的 SVG 批次并归档
  taxonomy.py                页面 → 分类 的唯一真源（两个脚本共用）
figma/tools/figma-plugin/    Figma 插件：无限次导出全部 SVG（见其 README）
figma/tools/build-catalog.py 把 SVG / 参数 / 原始树join成一张总表
design/                      ← 静态原型页（TSX 写 → 零 JS 单文件 HTML）
  SKILL.md                   方法论：先画后写、版式规则、状态用 props
  build.sh / shot.sh         构建 / 截图（产物 → design/pages/<项目>/）
  kits/                      一个项目一个文件夹：ios27 / macos27 / shared
    <kit>/screens            手绘页     <kit>/atlas  图集页（生成）
  system/                    工具链：jsx runtime、build、theme、公共组件
  scripts/atlas.py           从 figma/reference 生成全组件图集
```

## 分类（两套 kit 共用同一套功能轴）

`01-navigation` `02-bars` `03-controls` `04-input` `05-collections` `06-overlays`
`07-system` `08-tokens`（`00-meta` 已排除：封面/示例/License 页的插画会污染调色板统计）

## 重新生成

```bash
python3 figma/tools/figma-pull/extract.py --kit macos27     # 只读本地缓存，0 次 API 调用
python3 figma/tools/figma-pull/extract.py --kit ios27
```

只有 `pull.py` 会消耗 Figma 配额；`extract.py` 完全离线，可以随便重跑改分类。

## Figma 配额账本（Starter 免费计划 = 6 次/文件/月）

| 文件 | 已用 | 用途 | 剩余 |
|---|---|---|---|
| macos27 | ~2 | `/components`（返回空，浪费）+ `/files` 完整树 | ~4 |
| ios27 | ~2 | 同上 | ~4 |

已拿到的数据**不需要再拉**：原始树在 `figma/reference/_raw/`，重跑抽取是 0 配额。

## 当前成果

| 平台 | 主组件 | SVG | 参数 | 空文件 | 未归属 |
|---|---|---|---|---|---|
| macOS 27 | 184 | 647 | 184 | 0 | 0 |
| iOS 27 | 335 | 840 | 335 | 0 | 0 |
| 合计 | **519** | **1487** | **519** | 0 | 0 |

重新生成总表（纯本地，0 配额）：

```bash
python3 figma/tools/build-catalog.py
```

## 组件视觉导出（SVG）—— 走插件桥，0 配额

REST 的 `/images` 在免费计划下远远不够（3129 个组件要 13–32 次调用，额度只有 8 次）。
所以视觉层用插件桥：插件在 Figma 内部读文档，POST 到本机，无限次。

完整操作步骤见 [figma/tools/figma-plugin/README.md](figma/tools/figma-plugin/README.md)。最短版本：

```bash
python3 figma/tools/figma-pull/receiver.py      # 终端 1，全程开着
# Figma → Plugins → Development → Import plugin from manifest → 选 manifest.json
# 打开 kit 文件（先 Duplicate 一份自己的）→ Run → Start All
```

产出 `figma/reference/<kit>/svg/<分类>/`，按节点 id 去重，可断点续传、可重复跑。

## 原型页（`design/`）

从 OpenCut 移植的静态原型页系统：页面用 TSX 写，构建成**零 JS 的单文件 HTML**，JSX 只在构建时跑一次。

```bash
pnpm design:build     # → design/pages/<项目>/**/*.html（自包含 Deno，装在 design/.bin/）
pnpm design:shot      # → design/shots/**（headless Chrome）
```

**一个项目一个文件夹**：`design/kits/ios27/`、`design/kits/macos27/` 各自独立，
产物镜像到 `design/pages/ios27/`、`design/pages/macos27/`。新增项目照此新建文件夹，不要混放。

改得快的原因：状态是 props（加一个态 = 加一行）、颜色字体全在 `theme.ts`（改一处全站变）、
重复结构抽组件、产物不入库可随时重生成。方法论见 [design/SKILL.md](design/SKILL.md)，
用法见 [design/README.md](design/README.md)。

## 许可证

Apple Design Resources 允许用来设计 App，**不允许把素材再分发成组件库**。
所以 `figma/reference/` 已写进 `.gitignore`：本机参考可以，不要提交、不要打进发布的 SPM 包。
对外发布的只能是自己的 `DesignTokens`（从 tokens/ 抄数值）和 `DesignKit`（自己写的代码）。

`.figma.env` 存 token，已 gitignore，chmod 600。
