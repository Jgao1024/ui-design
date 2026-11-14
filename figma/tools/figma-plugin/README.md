# Figma 桥：把两个 UI Kit 的全部组件导成 SVG

插件跑在 Figma 内部，直接读文档并 POST 到本机接收器 —— **不经过 REST API，不消耗任何额度**。

```
Figma 插件（导出 SVG）
        │  POST /batch  (每 20 个一批)
        ▼
receiver.py  ──►  figma/reference/<kit>/svg/<分类>/<页面>__<组件名>.svg
             ──►  figma/reference/<kit>/svg/_received.jsonl   （断点续传的记录）
             ──►  figma/reference/<kit>/svg/MANIFEST.json + index.md
```

> 接收器写入前会自动把内嵌位图压到显示尺寸（见下节），所以插件端不必为
> 「SVG 太大」做拆分，`MAX_AREA` 与 `MAX_SVG_BYTES` 都放到了整窗示例不会触发拆分的阈值。

## 内嵌位图会被自动压缩（svg_shrink.py）

Figma 导出会把画板上的图片原样 base64 内嵌。一套 macOS 桌面壁纸 26 MB、一张导出
里出现一次就是 26 MB —— 历史上 42 次引用共吃掉 1.1 GB。

`receiver.py` 在写盘前调用 `svg_shrink.py`：

| 图片 | 处理 | 典型 |
|---|---|---|
| 壁纸（`Wallpaper-*`、不透明的 `image.png`） | 最长边 1512，JPEG q75 | 26 MB → 107 KB |
| 设备外框（iPhone / iPad / MacBook） | 最长边 768，PNG（保留透明） | 1.3 MB → 46 KB |
| 图标 | 最长边 256，PNG（保留透明） | 250 KB → 20 KB |

只替换 `<image>` 里的 payload 与 MIME，**SVG 结构一个字节都不动**；带 alpha 的图强制
保持 PNG。已存在的旧数据可以重新压一遍：

```bash
python3 figma/tools/figma-pull/svg_shrink.py figma/reference
```

## 六步操作

**0. 起接收器**（单独一个终端窗口，全程开着）

```bash
cd ~/Git/ui-design
python3 figma/tools/figma-pull/receiver.py
```

看到 `receiver: http://127.0.0.1:8917` 就成了。浏览器打开这个地址能看到状态页。

**1. 先把 kit 拷到自己账号**
这两个是 Community 文件，你只有**只读**权限，插件跑不了。打开文件后点右上角
**Duplicate**（或 ⌘D）→ 存到自己的 Drafts，用**你自己那份**来跑。

**2. 导入插件**
菜单 **Figma → Plugins → Development → Import plugin from manifest…**
→ 选 `figma/tools/figma-plugin/manifest.json` → Open。

> 只需导入一次。以后在 Plugins → Development 里直接能看到。

**3. 运行**
打开 macOS 27 那份文件 → **Plugins → Development → UI Design Kit Puller**
→ 点 **Start All**。

进度条跑完会打印每个分类的写入数量。中途随便停，重跑不会重复（按节点 id 去重）。

**4. 换 iOS 27 那份文件**，同样运行一次。接收器不用重启，会自动识别成 `ios27`。

**5. 验收**

```bash
find figma/reference -name '*.svg' | wc -l        # 应该有几千个
open figma/reference/macos27/svg/index.md
```

## 出问题怎么修

| 现象 | 原因 | 修法 |
|---|---|---|
| 导入时报 `networkAccess` / manifest 校验错 | 你的 Figma 版本对域名格式更严 | 把 `manifest.json` 里 `allowedDomains` 改成 `["*"]`（开发插件允许，会有一条黄色警告），重存再导入 |
| 点 Start 后提示「连不上接收器」 | 接收器没起，或端口冲突 | 确认终端那行还在跑；`lsof -i :8917` 看是否被占 |
| 插件面板能开但一直 0 | 文件是只读的 community 副本 | 回到第 1 步，Duplicate 一份自己的 |
| 个别组件报「跳过 XXX」 | 空尺寸、SLOT 或不可渲染节点 | 正常现象，日志会列出来，不影响其余 |
| 想看每批的收发日志 | 默认安静 | 接收器加 `--verbose` 重跑 |
| 跑一半断了 | 网络/内存 | 直接再点 Start All，已写入的会跳过 |

## 为什么不用 MCP

官方 Dev Mode MCP 要付费 Dev/Full 席位；REST API 在免费计划下每个文件每月只有
6 次内容请求。插件走的是 Figma 内部的文档访问，属于你自己的编辑器会话，所以既不
收费也没有配额 —— 所有「免费 Figma MCP」用的都是这个原理。

## 浏览器自动化尝试记录（已放弃）

在未安装桌面版的前提下试过用 CDP 驱动 Chrome 完成导出，结论：

- 能用：`?node-id=<pageId>` 直接切页、⌘A 全选、⇧⌘E（导出列表）、截图。
- 不能用：Figma 的右侧面板与画布都是 **canvas 渲染**（整页 innerText 只有约 110 字符），
  合成鼠标事件命中不稳定——同一坐标前一分钟能点中，下一分钟完全无响应；
  面板高度还随选中数量变化，坐标无法复用。
- 因此每页仍需人工点一次，69 页成本高于直接装桌面版。

真正的快捷键结论（Figma 官方）：
**⇧⌘E = 导出列表**，但它只导出「已经有导出设置」的图层；
必须先到右侧面板 Export 区点 `+` 打标记，多选时一次 `+` 作用于全部选中项。
快捷键不能跳过「先标记」这一步，所以没有纯键盘的一键全量导出。
