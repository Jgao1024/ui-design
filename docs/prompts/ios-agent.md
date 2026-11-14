# 任务：实现 iOS 27 组件展示 App

## 0. 边界（先读，必须遵守）

- **只能写入 `apps/ios/` 下的文件。**
- 只读，不得修改：
  - `docs/ios-components.md`（**唯一需求来源**，全文都是需求）
  - `reference/ios27/`、`reference/_raw/ios27-*.json`
  - `tools/refdata.py`、`tools/figma-pull/`
- 禁止创建或修改：`apps/macos/**`、`docs/**`、`tools/**`、根目录的 `package.json`、`pnpm-workspace.yaml`、`.gitignore`、`pnpm-lock.yaml`、`node_modules/`。
- 禁止新增依赖。确实需要时，写进最终报告，不要自己装。
- 不跑任何 git 命令，不读 `.figma.env`，不修改 `reference/`。
- 不建共享包，不 import `apps/macos/**`。另一个 agent 在同时开发 macOS App，两边代码重复是有意的，目的是避免冲突。

## 1. 目标

阅读 `docs/ios-components.md`，按文档实现一个静态网页 App：把第 5 节列出的全部页面和组件族集中展示，用右下角浮窗按钮 + `⌘K` 面板快速切换。只展示，不编辑，没有后端。

## 2. 技术约束

- Vite 8 + 原生 TypeScript（strict），不用任何前端框架。根目录已安装 `vite`、`typescript`。
- 目录结构（全部在 `apps/ios/` 下）：

```
index.html
main.ts
vite.config.ts        # 内容：export default { base: './' }
tsconfig.json         # strict, noEmit, moduleResolution=bundler, lib 含 DOM, types 含 vite/client, include main.ts 和 src
src/                  # 前端代码
scripts/build-data.py # 数据脚本
public/data/          # 脚本生成，已被 .gitignore 忽略
public/svg/           # 脚本复制，已被 .gitignore 忽略
```

- 根目录已配好这些命令，**不要改**：`pnpm data:ios`、`pnpm dev:ios`（端口 5174）、`pnpm build:ios`、`pnpm typecheck:ios`。
- App 运行时只读 `public/data/` 下的 JSON，不直接读 `reference/`。

## 3. 数据脚本要点（`scripts/build-data.py`）

- 复用公共读取代码：脚本开头 `sys.path.insert(0, <仓库根>/tools)`，然后 `from refdata import ROOT, REF, CATEGORY_LABEL, HIG, HIG_URL, TOKEN_PAGES, walk`。
  - `walk(node, page, in_set, out)`：遍历 `reference/_raw/ios27-file.json` 的 `document.children`，`out` 初始化为 `{"sets": [], "solo": []}`。
  - `out["sets"]` 每项：`page, name, id, variants, axes(有序字典), kids[{id,name,w,h}]`。
  - `out["solo"]` 每项：`page, name, id, w, h`。
  - 以 `_` 开头的名字是内部件。
- 页面清单与顺序：`reference/ios27/MANIFEST.json` 的 `pages`，跳过 `bucket == "00-meta"`。令牌页追加到 `08-tokens` 末尾，页面 slug 固定为 `tokens-colors`、`tokens-typography`、`tokens-effects`、`tokens-geometry`。
- 规格：`reference/ios27/specs/<分类>/*.json`，**用文件内的 `nodeId` 字段匹配**，不要用文件名。单个文件可能很大，必须**瘦身后再输出**，只保留：尺寸、圆角、布局方向与间距、填充（hex + alpha）、效果类型、文字样式（字体、字重、字号、行高、字距、文本）。禁止原样复制。
- SVG：`reference/ios27/svg/MANIFEST.json` 的 `items[]` 里 `id` 就是 nodeId，`file` 是相对 `reference/ios27/` 的路径。命中的才复制到 `public/svg/`。**目录或文件不存在时不能报错**，输出的数据里不带 `svg` 字段即可，前端据此显示占位。
- 脚本末尾打印四个数字用于对账：**页面 40、公开族 81、独立组件 67、变体 520**（含义见文档第 1 节）。

## 4. 展示细节（文档没写的约定）

- 画布背景随主题：Light `#ffffff`，Dark `#1e1e1e`。
- 占位矩形：灰色，宽高取 `_raw` 树里节点的 `absoluteBoundingBox`，旁边显示轴值标签。
- **iOS 的 `Mode` 轴值很杂**（`Light`、`Dark`、`Default`、`Active`、`Inactive`、`IC - Light`、`IC - Dark`）。只有同时含 `Light` 和 `Dark` 的轴才受全局明暗开关控制，其余轴照常进网格。
- **设备筛选**（文档第 2 节第 6 条）：面板里放 全部 / iPhone / iPad / iPhone Duo，默认 iPhone，选择存 `localStorage`。判断顺序：先 `iPhone Duo`，再 `iPad`，最后 `iPhone`；不含设备词的始终显示。作用范围：公开族、独立组件、内部件。
- 令牌页渲染：
  - 颜色：色块网格（hex、alpha、使用次数）和渐变条。
  - 文字样式（296 条）：每条一行样例文本，标注字体、字重、字号、行高、字距。
  - 效果：表格（类型、定义摘要、使用次数）。
  - 几何：圆角、间距、组件尺寸，每项一个小芯片，附使用次数。
- 页面顶部显示 `当前序号 / 总页数`，便于翻页。

## 5. 分步执行

按文档第 8 节 D1 到 D5 顺序做，一步做完再做下一步：

1. D1 数据脚本
2. D2 外壳：浮窗按钮、`⌘K` 面板、搜索、设备筛选、`←` `→`、hash 路由、明暗开关
3. D3 页面渲染（占位图）
4. D4 只读规格面板
5. D5 SVG 接入

## 6. 测试策略

用户要求开发过程中**不做测试**，最后由用户亲自验收。

- 不写测试，不开浏览器，不启动开发服务器。
- 全部完成后，只运行一次 `pnpm data:ios`、`pnpm typecheck:ios`、`pnpm build:ios`，确保能编译通过。

## 7. 交付报告（最后一条消息）

1. 完成清单（D1 到 D5 各一行）。
2. 运行方式：`pnpm data:ios && pnpm dev:ios`。
3. 数据脚本打印的四个数字。
4. 与文档不一致的地方，和你不确定的地方。
