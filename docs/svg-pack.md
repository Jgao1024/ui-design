# SVG 分类压缩包

Figma 导出的 686 个 SVG(`figma/reference/<kit>/svg/`)共 **281MB**,其中 **94% 是
base64 内嵌的位图**,且重复严重:2,626 次引用只对应 607 张唯一图。把位图抽出去重后,
按 Figma 分类打成 `tar.zst`,体积降到原来的 1/4 到 1/60。

## 两种包,按需取一种

| 目录 | 位图格式 | 总量 | 相对原始 | 说明 |
|---|---|---:|---:|---|
| `figma/svg-packed/` | PNG(Lossless) | **59MB** | 21% | 像素与原图完全一致 |
| `figma/svg-packed-webp/` | WebP q82 | **4.2MB** | 1.5% | 放大看位图有轻微损失 |

两个目录都是**没提交的**(`.gitignore` 里已忽略),要入库再决定。

## 能不能还原成原始 SVG

分两种,差别在位图:

| 包 | SVG 文本 | 位图 |
|---|---|---|
| `svg-packed/`(PNG) | 与原文件**逐字节相同** | 原 PNG 字节,完全可逆 |
| `svg-packed-webp/` | 与原文件**逐字节相同** | WebP 有损重编码,**还原不出原 PNG**,只有近似 |

无损包已实测:686 个文件全部能逐字节还原(把 `../img/<hash>.png` 重新内联成
`data:image/png;base64,...`,空的 `img/` 用原字节 base64 编码)。唯一要记住的规则:
包里 `.jpg` 对应原始 MIME 是 `image/jpeg`(不是 `image/jpg`),照这个规则拼回去就是原文件。

原始 281MB 目前仍留在 `figma/reference/`;把它删掉之后,只有无损包还能回到原样。

## 包结构

每个 `<kit>-<分类>.tar.zst` 解开后是两层,**必须保持同级**:

```
<kit>-<分类>/
├─ svg/<原文件名>.svg    ← 内嵌 base64 换成了 ../img/<hash>.webp
└─ img/<hash>.<png|webp> ← 该分类用到的唯一图,一图一份
```

`svg/` 里用相对路径 `../img/` 引用位图。**只拷 svg 不拷 img,图会全部显示不出来。**

## 怎么解压

macOS 自带 `tar` 已支持 zstd,下面的命令都在本仓库根目录跑,已实测通过。

**解一个分类(最短命令):**

```sh
tar --zstd -xf figma/svg-packed-webp/ios27-03-controls.tar.zst -C /tmp/svg
# → /tmp/svg/{svg,img}
```

**解全部,按 kit/分类分目录:**

```sh
./figma/tools/svg-pack/unpack.sh --all figma/svg-packed-webp /tmp/svg-all
# → /tmp/svg-all/ios27/03-controls/{svg,img}
```

**解一个分类,自动建分类子目录:**

```sh
./figma/tools/svg-pack/unpack.sh figma/svg-packed/ios27-03-controls.tar.zst /tmp/svg
# → /tmp/svg/03-controls/{svg,img}
```

**没装 zstd 的环境(任意平台都可以):**

```sh
tar -xf figma/svg-packed-webp/ios27-03-controls.tar.zst -C /tmp/svg
```

`tar --zstd` 报 `unknown option` 时,说明系统 tar 太老,用管道版:

```sh
zstd -dc figma/svg-packed-webp/ios27-03-controls.tar.zst | tar -xf - -C /tmp/svg
```

## 怎么看效果

解出来后直接双击 `svg/` 里的文件,或用浏览器打开,能正常显示图形和位图就说明没丢件。
批量对得上数量可以数一下:

```sh
ls /tmp/svg/svg/*.svg | wc -l    # 该分类 SVG 数
ls /tmp/svg/img | wc -l          # 唯一位图数
```

## 重新生成

```sh
python3 figma/tools/svg-pack/pack.py --mode webp      # → figma/svg-packed-webp/
python3 figma/tools/svg-pack/pack.py --mode lossless  # → figma/svg-packed/
```

只用本地 `figma/reference/`,**0 次 Figma API 调用**。需要 `zstd` 和(webp 模式)`Pillow`。

## 相关位置

| 东西 | 位置 | 是否入库 |
|---|---|---|
| 原始 686 个 SVG | `figma/reference/<kit>/svg/` | 否(`reference/` 整体忽略) |
| 压缩包 | `figma/svg-packed*/` | 待定 |
| 打包/解包脚本 | `figma/tools/svg-pack/` | 是 |
| web 画廊用的 SVG 副本 | `apps/*/public/svg/` | 否,由 `pnpm data:ios` 从原始重新生成 |

`apps/*/public/svg/` 曾占 173MB 且与 `figma/reference/` 逐字节相同,已删除;
需要时跑 `pnpm data:ios` / `pnpm data:macos` 重建。
