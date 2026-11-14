# SVG 无损分类压缩包

Figma 导出的 686 个 SVG(`figma/reference/<kit>/svg/`)共 **281MB**,其中 **94% 是
base64 内嵌的位图**,且重复严重:2,626 次引用只对应 607 张唯一图。把位图抽出去重后,
按 Figma 分类打成 `tar.zst`,降到 **60MB(原体积的 21%,精确 60.4MB)**。

**无损**:位图存的是 base64 解码后的原始字节,SVG 文本除数据 URI 外一个字节没改,
686 个文件全部可以逐字节还原(实测 686/686 一致)。

产物在 `figma/svg-packed/`,**暂未入库**(`.gitignore` 已忽略),要不要提交单独决定。

## 包结构

每个 `<kit>-<分类>.tar.zst` 解开后是两层,**必须保持同级**:

```
<kit>-<分类>/
├─ svg/<原文件名>.svg    ← 内嵌 base64 换成了 ../img/<hash>.png
└─ img/<hash>.png        ← 原始 PNG 字节,一图一份
```

`svg/` 里用相对路径 `../img/` 引用位图。**只拷 svg 不拷 img,图会全部显示不出来。**

## 怎么解压

macOS 自带 `tar` 已支持 zstd,下面的命令都在本仓库根目录跑,已实测通过。

**解一个分类(最短命令):**

```sh
tar --zstd -xf figma/svg-packed/ios27-03-controls.tar.zst -C /tmp/svg
# → /tmp/svg/{svg,img}
```

**解全部,按 kit/分类分目录:**

```sh
./figma/tools/svg-pack/unpack.sh --all figma/svg-packed /tmp/svg-all
# → /tmp/svg-all/ios27/03-controls/{svg,img}
```

**解一个分类,自动建分类子目录:**

```sh
./figma/tools/svg-pack/unpack.sh figma/svg-packed/ios27-03-controls.tar.zst /tmp/svg
# → /tmp/svg/03-controls/{svg,img}
```

**没装 zstd 的环境(任意平台都可以):**

```sh
tar -xf figma/svg-packed/ios27-03-controls.tar.zst -C /tmp/svg
```

`tar --zstd` 报 `unknown option` 时,说明系统 tar 太老,用管道版:

```sh
zstd -dc figma/svg-packed/ios27-03-controls.tar.zst | tar -xf - -C /tmp/svg
```

## 怎么看效果

解出来后直接双击 `svg/` 里的文件,或用浏览器打开,能正常显示图形和位图就说明没丢件。
批量对得上数量可以数一下:

```sh
ls /tmp/svg/svg/*.svg | wc -l    # 该分类 SVG 数
ls /tmp/svg/img | wc -l          # 唯一位图数
```

## 还原成原始 SVG

需要原文件时,把 `../img/<hash>.png` 内联回 `data:image/png;base64,...` 即可,
其余内容逐字节相同。唯一要记住的规则:包里 `.jpg` 对应的原始 MIME 是
`image/jpeg`(不是 `image/jpg`),照这个规则拼回去就和原件一模一样。

## 重新生成

```sh
python3 figma/tools/svg-pack/pack.py            # → figma/svg-packed/
python3 figma/tools/svg-pack/pack.py --out /tmp/x
```

只用本地 `figma/reference/`,**0 次 Figma API 调用**,只依赖系统 `tar`/`zstd`。

## 相关位置

| 东西 | 位置 | 是否入库 |
|---|---|---|
| 原始 686 个 SVG | `figma/reference/<kit>/svg/` | 否(`reference/` 整体忽略) |
| 无损压缩包 60MB | `figma/svg-packed/` | 待定 |
| 打包/解包脚本 | `figma/tools/svg-pack/` | 是 |
| web 画廊用的 SVG 副本 | `apps/*/public/svg/` | 否,由 `pnpm data:ios` 从原始重新生成 |

`apps/*/public/svg/` 曾占 173MB 且与 `figma/reference/` 逐字节相同,已删除;
需要时跑 `pnpm data:ios` / `pnpm data:macos` 重建。
