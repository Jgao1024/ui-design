# Figma 原始文档树(`_raw`)

`figma/reference/_raw/` 是 `pull.py` 从 Figma REST 拉下来的完整文档树,96MB:

| 文件 | 大小 | 内容 |
|---|---:|---|
| `ios27-file.json` | 49MB | iOS 27 整份文件的完整节点树 |
| `macos27-file.json` | 43MB | macOS 27 整份文件的完整节点树 |
| `*-components.json` | 各 73B | `/components` 探测结果(社区副本没有 library 组件,所以是空的) |

它是**纯 JSON**,键名高度重复,`zstd -19` 能压到 **1.5MB(1.5%)**,且逐字节可逆。
本地原件已删,压缩包在 `figma/raw-archive/_raw.tar.zst`(**已入库**)。

## 为什么值得留

`extract.py` 从这份树里抽 `specs/` 和 `tokens/`。留着 1.5MB,以后想改分类规则、
重抽参数,都是 **0 次 Figma API 调用**;删了就要重新拉,吃 Starter 计划配额
(6 次/文件/月,两个文件各已用约 2 次)。

## 用法

```sh
python3 figma/tools/raw-pack/rawpack.py restore   # 还原 → figma/reference/_raw/(96MB)
python3 figma/tools/raw-pack/rawpack.py verify    # 只比对，确认包和现有原件一致
python3 figma/tools/raw-pack/rawpack.py pack      # 重新打包（原件在场时）
```

还原之后就能重跑抽取:

```sh
python3 figma/tools/figma-pull/extract.py --kit macos27
python3 figma/tools/figma-pull/extract.py --kit ios27
```

## 压缩比实测

| 方式 | macos27-file.json(43MB) | 耗时 |
|---|---:|---:|
| zstd -19 | 598KB | 5.5s |
| zstd --ultra -22 | 552KB | 26s |
| xz -9e | 560KB | 7.6s |

选 zstd -19:只比最狠的多 8%,快 5 倍。

## 相关位置

| 东西 | 位置 | 入库 |
|---|---|---|
| 压缩包 1.5MB | `figma/raw-archive/_raw.tar.zst` | 是 |
| 脚本 | `figma/tools/raw-pack/rawpack.py` | 是 |
| 原始 96MB | 本地已删,`restore` 可还原 | — |
