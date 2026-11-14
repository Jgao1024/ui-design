# macOS 自带应用截图库

27 个系统自带应用 × 深色/浅色 × 每个应用 3–5 个操作态，全部由脚本自动截取。
只截**窗口本身**（含标题栏，不含桌面、不含阴影），Retina 2x 原始分辨率。

## 数字

| 项目 | 数量 |
|---|---|
| 应用 | 27 |
| 整窗截图 | 198 张（深色 106 / 浅色 92） |
| 组件切片 | 2754 张（2x 原图 + 1x 副本） |
| 去重后组件样式 | 499 组 |
| AX 结构快照 | 每个截图一份 JSON，共 198 份 |

## 目录

```
macos-shots/
├─ shots/<dark|light>/<NN-slug>/<step>.png      整窗截图（按应用分文件夹）
├─ structure/<dark|light>/<NN-slug>/<step>.json 每个截图的 AX 树（角色/坐标/尺寸/文案）
├─ components/                                    ← 归一化组件库
│  ├─ <dark|light>/<class>/                       全部切片，2x
│  ├─ <dark|light>/_1x/<class>/                   同名 1x 版本（贴原型用）
│  ├─ canonical/<dark|light>/<class>/             去重后的样式样本
│  ├─ manifest.csv   每片：主题/类/角色/变体/应用/步骤/尺寸/像素哈希
│  ├─ canonical.csv  每样式组：被几个应用用到、来源列表
│  ├─ tokens.csv     每片测得的 bg / fg / accent 色值与 pt 尺寸
│  └─ index.html     组件画廊（按类分组、按使用次数排序）
├─ logs/manifest-<theme>.csv                     截图清单（窗口坐标/尺寸/哈希/重复标记）
├─ _review/                                      拼图（快速过一遍用）
├─ index.html                                    整窗截图画廊
├─ recipes/<NN-slug>.json                        每个应用的操作剧本
├─ scripts/                                      工具链（见下）
├─ bin/maccap                                    Swift 采集器（窗口/AX/截屏/键鼠）
└─ assets/                                       示例图片与示例文件夹（避免截到真实数据）
```

## 组件分类

| 目录 | 内容 |
|---|---|
| `01-navigation` | 侧栏项、标签组、展开箭头 |
| `02-button` | 文字按钮、图标按钮、工具栏按钮、下拉按钮 |
| `03-input` | 搜索框、文本框、文本域、下拉框 |
| `04-menu` | 菜单栏项、菜单项、菜单面板 |
| `05-list` | 列表行、大纲行、表格单元 |
| `06-control` | 勾选、单选、开关、滑块、步进器、分段控件 |
| `07-feedback` | 进度、等级指示（本轮未采到，需指定应用） |
| `08-layout` | 工具栏、分栏、窗口骨架 |

命名：`<序号>--<应用>--<变体>.png`；canonical 命名 `<基类>--h<高度档>--<像素哈希前 6 位>.png`。

## 重跑

```bash
python3 scripts/gen_recipes.py                # 改脚本里的 APPS 表 → 生成 recipe
python3 scripts/run.py --batch 1 --themes dark
python3 scripts/run.py --all --themes dark,light
python3 scripts/run.py --apps finder,notes --themes light

PY=/Users/jgao/.dsh/dsh-runtimes/dsh-primary-runtime/dependencies/python/bin/python3
$PY scripts/build_index.py     # index.html + _review/montage-*.png
$PY scripts/build_atoms.py     # 切片 + 去重 + 样式测量
$PY scripts/build_gallery.py   # components/index.html + _review/atoms-*.png
```

`run.py` 会自动切深浅色、按 recipe 发快捷键/点选/输入、逐张截图、dump AX 树，
结束时把外观恢复成深色。窗口优先统一到 1400×880；应用拒绝调整时保留原生尺寸并如实记录。

## 已知限制

- **邮件**：本机未登录账户，打开即弹「添加账户」表单，任何关闭操作都会让 App 退出。
  4 张图内容相同（工具栏可见，主体是登录表单）。
- **信息 / FaceTime**：未登录，窗口固定小尺寸（640×617），只有欢迎/登录页。
- **访达**：拒绝 AX 调整尺寸（macOS 26 行为），用拖拽缩放到 1360×845。
- **SwiftUI 类应用**（计算器、天气、股市）：AX 不暴露内部控件坐标，切片数量少。
- 25 张图标注为重复（`duplicate_of` 列），多为空态下操作未改变画面，可据此裁剪。

## 用法建议

1. 先看 `index.html` 过一遍整窗，确认哪些应用值得深挖。
2. 看 `components/index.html`，`canonical.csv` 里 `count` 越大说明系统里越通用（例如 `05-list/row h32` 被 7 个应用共用）。
3. 做原型时直接用 `_1x/` 里的切片，`tokens.csv` 提供实测色值。
