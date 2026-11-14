// UI Design Kit Puller — exports every component as SVG and hands batches to the
// local receiver (tools/figma-pull/receiver.py). No REST API, no quota.
//
// Big boards are never skipped: a node that is too large is split into its children,
// which are exported one by one (recursively, up to MAX_DEPTH).

const BATCH_SIZE = 4;             // small batches keep memory flat
// 关键：按「累计字节」而不是「个数」攒批。
// 一张带桌面壁纸的整窗 SVG 就有 30 MB，攒 4 张 = 120 MB，
// 再乘上 postMessage 的复制和 JSON.stringify 的字符串，插件沙箱必爆。
// 4 MB 意味着大图一定是「一张一批」。
const MAX_BATCH_BYTES = 4_000_000;
const NODE_TIMEOUT_MS = 45000;    // 大画板导出慢，15 s 会误判超时
// 3,000,000 px²: 整窗示例（1512×993 = 1,501,416、1736×1133 = 1,966,888）要整块导出。
// 原来的 1,500,000 比 1512×993 只小 1,416 px²，把每个整窗示例都误拆成碎片。
const MAX_AREA = 3_000_000;
// 40 MB: 带桌面壁纸的整窗导出本来就有 33 MB，接收器 (svg_shrink.py) 会把它压到 ~100 KB。
// 设 4 MB 会让每个整窗导出都被判「太大」然后拆碎。
const MAX_SVG_BYTES = 40_000_000;
const MAX_DEPTH = 3;
const MAX_CHILDREN = 300;

let cancelled = false;
let ackResolve = null;
let ackReject = null;
let doneResolver = null;

let nodesResolver = null;
function requestNodes(kit) {
  figma.ui.postMessage({ type: 'need-nodes', kit: kit });
  return new Promise(function (res) {
    nodesResolver = res;
    setTimeout(function () { if (nodesResolver) { const r = nodesResolver; nodesResolver = null; r([]); } }, 20000);
  });
}

function requestDone(kit) {
  figma.ui.postMessage({ type: 'need-done', kit: kit });
  return new Promise(function (res) {
    doneResolver = res;
    setTimeout(function () { if (doneResolver) { const r = doneResolver; doneResolver = null; r([]); } }, 9000);
  });
}

figma.showUI(__html__, { width: 460, height: 430, themeColors: true });

function errText(e) {
  return (e && (e.message || e.name)) ? (e.name ? e.name + ': ' : '') + e.message : String(e);
}
function log(text, kind) { figma.ui.postMessage({ type: 'log', text: text, kind: kind || 'info' }); }

function reportFailure(kit, node, pageName, name, error) {
  figma.ui.postMessage({
    type: 'failure',
    item: { kit: kit, id: node && node.id, name: name || (node && node.name),
            page: pageName, error: error }
  });
}

function bytesToText(bytes) {
  try {
    if (typeof TextDecoder !== 'undefined') return new TextDecoder('utf-8').decode(bytes);
  } catch (e) { /* fall through */ }
  let s = '';
  const CH = 8192;
  for (let i = 0; i < bytes.length; i += CH) s += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return decodeURIComponent(escape(s));
}

function withTimeout(promise, ms, label) {
  return new Promise(function (resolve, reject) {
    let done = false;
    const t = setTimeout(function () {
      if (!done) { done = true; reject(new Error('timeout ' + ms + 'ms on ' + label)); }
    }, ms);
    promise.then(function (v) {
      if (!done) { done = true; clearTimeout(t); resolve(v); }
    }, function (e) {
      if (!done) { done = true; clearTimeout(t); reject(e); }
    });
  });
}

async function exportSvg(node) {
  const base = { format: 'SVG', svgIdAttribute: true, svgSimplifyStroke: false };
  try {
    return bytesToText(await node.exportAsync(Object.assign({ svgOutlineText: false }, base)));
  } catch (e1) {
    return bytesToText(await node.exportAsync(Object.assign({ svgOutlineText: true }, base)));
  }
}

function flush(buffer, kit) {
  if (!buffer.length) return Promise.resolve();
  const items = buffer.splice(0, buffer.length);
  figma.ui.postMessage({ type: 'chunk', kit: kit, items: items });
  items.length = 0;
  return new Promise(function (resolve, reject) { ackResolve = resolve; ackReject = reject; });
}

// Only真没用的页面跳过；Examples（用法示例）和 _Kit（内部素材）要保留
const META_PAGES = ['cover', 'getting started', 'change log', 'license'];

function isMetaPage(name) {
  const low = (name || '').trim().toLowerCase();
  if (!low) return true;
  if (/^[-—]+$/.test(low)) return true;
  return META_PAGES.indexOf(low) !== -1;
}

// Manual recursion instead of findAllWithCriteria: components nested inside
// SECTION / FRAME / GROUP are otherwise easy to miss (that is how the Alerts page
// silently produced nothing). We stop at a COMPONENT_SET so its variants are not
// exported twice.
function walkMasters(node, out) {
  const kids = node.children || [];
  for (const c of kids) {
    if (c.type === 'COMPONENT_SET') { out.push(c); continue; }
    if (c.type === 'COMPONENT') { out.push(c); continue; }
    walkMasters(c, out);
  }
  return out;
}

// With documentAccess:"dynamic-page" a page's children are only reliable once the
// page has been loaded. Reading .children of a not-yet-loaded page throws, which is
// exactly how the Alerts page kept silently contributing 0 nodes. So: switch to the
// page first, then walk it.
async function collect() {
  await figma.loadAllPagesAsync();
  const out = [];
  for (const page of figma.root.children) {
    if (page.type !== 'PAGE') continue;
    if (isMetaPage(page.name)) continue;
    try { await figma.setCurrentPageAsync(page); }
    catch (e) { log('切页失败「' + page.name + '」: ' + errText(e), 'error'); }
    let nodes = [];
    try {
      nodes = walkMasters(page, []);
    } catch (e) {
      log('读取页面失败「' + page.name + '」: ' + errText(e), 'error');
      nodes = [];
    }
    const sets = nodes.filter(function (n) { return n.type === 'COMPONENT_SET'; }).length;
    log('页面「' + page.name + '」→ ' + nodes.length + ' 个（' + sets + ' 个组件集）');
    nodes.sort(function (a, b) { return (a.name || '').localeCompare(b.name || ''); });
    if (nodes.length) out.push({ page: page, nodes: nodes });
  }
  return out;
}

async function run(force) {
  cancelled = false;
  const file = figma.root.name || '';
  const kit = /macos|mac os/i.test(file) ? 'macos27' : (/visionos/i.test(file) ? 'visionos' : 'ios27');
  log('文件：' + file);
  log('识别为 kit：' + kit);

  const doneIds = force ? [] : await requestDone(kit);
  const wanted = await requestNodes(kit);
  const doneSet = new Set(doneIds || []);

  if (!wanted.length) {
    log('接收器没有返回主组件清单。确认 reference/_raw/<kit>-file.json 存在，并重跑接收器。', 'error');
    return;
  }
  const total = wanted.length;
  log('按接收器清单导出：' + total + ' 个主组件（含 Alerts 这类嵌在 SECTION 里的）');
  if (doneSet.size) log('接收器已有 ' + doneSet.size + ' 个，跳过它们', 'warn');

  figma.ui.postMessage({ type: 'started', kit: kit, total: total, file: file });

  const buffer = [];
  let bufferBytes = 0;
  let processed = 0, emitted = 0, failed = 0, skipped = 0;

  async function maybeFlush() {
    if (buffer.length >= BATCH_SIZE || bufferBytes >= MAX_BATCH_BYTES) {
      await flush(buffer, kit);
      bufferBytes = 0;
      await new Promise(function (r) { setTimeout(r, 120); });
    }
  }

  async function push(node, pageName, name) {
    const box = node.absoluteBoundingBox || { width: 0, height: 0 };
    const svg = await withTimeout(exportSvg(node), NODE_TIMEOUT_MS, node.name);
    if (svg.length > MAX_SVG_BYTES) return { tooBig: true, size: svg.length };
    buffer.push({
      id: node.id, name: name, type: node.type, page: pageName,
      w: Math.round(box.width), h: Math.round(box.height), svg: svg
    });
    bufferBytes += svg.length;
    emitted++;
    await maybeFlush();
    return { ok: true };
  }

  // Never drops content: an oversized node is decomposed into its children.
  async function emit(node, pageName, depth, prefix, label) {
    if (cancelled) return;
    if (doneSet.has(node.id)) { skipped++; return; }

    const box = node.absoluteBoundingBox;
    if (!box || !box.width || !box.height) {
      failed++;
      log('跳过「' + (prefix ? prefix + ' / ' : '') + node.name + '」— 没有尺寸信息', 'warn');
      reportFailure(kit, node, pageName, prefix ? prefix + ' / ' + node.name : node.name, 'no bounding box');
      return;
    }
    const name = prefix ? prefix + ' / ' + node.name : (label || node.name);
    if (depth === 0) log('▶ ' + pageName + ' / ' + name + '  (' + Math.round(box.width) + '×' + Math.round(box.height) + ')');
    const area = box.width * box.height;
    const kids = (node.children || []).filter(function (c) { return c.visible !== false; });
    const canSplit = kids.length > 1 && depth < MAX_DEPTH;

    if (area > MAX_AREA && canSplit) {
      log('拆分大画板「' + name + '」' + Math.round(box.width) + '×' + Math.round(box.height) +
          ' → ' + Math.min(kids.length, MAX_CHILDREN) + ' 块', 'warn');
      const slice = kids.slice(0, MAX_CHILDREN);
      for (const kid of slice) await emit(kid, pageName, depth + 1, name);
      if (kids.length > MAX_CHILDREN) log('「' + name + '」子层过多，只取前 ' + MAX_CHILDREN + ' 个', 'warn');
      return;
    }

    let res;
    try {
      res = await push(node, pageName, name);
    } catch (e) {
      failed++;
      log('失败「' + name + '」— ' + errText(e), 'warn');
      reportFailure(kit, node, pageName, name, errText(e));
      return;
    }
    if (res.tooBig) {
      if (canSplit) {
        log('SVG ' + Math.round(res.size / 1e6) + ' MB 偏大，改拆分「' + name + '」', 'warn');
        const slice = kids.slice(0, MAX_CHILDREN);
        for (const kid of slice) await emit(kid, pageName, depth + 1, name);
      } else {
        log('「' + name + '」' + Math.round(res.size / 1e6) + ' MB 且无子层可拆，仍然导出', 'warn');
        const box2 = node.absoluteBoundingBox || { width: 0, height: 0 };
        try {
          const raw = await withTimeout(exportSvg(node), 60000, node.name);
          buffer.push({
            id: node.id, name: name, type: node.type, page: pageName,
            w: Math.round(box2.width), h: Math.round(box2.height), svg: raw
          });
          bufferBytes += raw.length;
          emitted++;
          await maybeFlush();
          doneSet.add(node.id);
        } catch (e2) {
          failed++;
          log('大文件导出失败「' + name + '」' + errText(e2), 'warn');
          reportFailure(kit, node, pageName, name, 'oversize retry: ' + errText(e2));
        }
      }
      return;
    }
    doneSet.add(node.id);
  }

  for (const w of wanted) {
    if (cancelled) break;
    let node = null;
    try { node = await figma.getNodeByIdAsync(w.id); } catch (e) { node = null; }
    if (!node) {
      failed++;
      log('找不到节点「' + w.page + ' / ' + w.name + '」(' + w.id + ')', 'warn');
      reportFailure(kit, { id: w.id, name: w.name }, w.page, w.name, 'getNodeByIdAsync returned null');
    } else {
      try { if (node.page) await figma.setCurrentPageAsync(node.page); }
      catch (e) { log('切页失败「' + w.page + '」: ' + errText(e), 'warn'); }
      await emit(node, w.page, 0, '', w.name);
    }
    processed++;
    figma.ui.postMessage({ type: 'progress', done: processed, total: total, failed: failed, emitted: emitted });
  }

  try { await flush(buffer, kit); } catch (e) { log('末批失败：' + errText(e), 'error'); }
  buffer.length = 0;
  bufferBytes = 0;
  figma.ui.postMessage({ type: 'progress', done: processed, total: total, failed: failed, emitted: emitted });
  figma.ui.postMessage({
    type: 'finished', kit: kit, done: processed, emitted: emitted,
    failed: failed, skipped: skipped, cancelled: cancelled
  });
  log((cancelled ? '已取消。' : '完成。') + '顶层 ' + processed + '，写出 ' + emitted +
      '，跳过 ' + skipped + '，失败 ' + failed, cancelled ? 'warn' : 'ok');
}

figma.ui.onmessage = function (msg) {
  if (!msg || !msg.type) return;
  if (msg.type === 'start' || msg.type === 'restart') {
    run(msg.type === 'restart').catch(function (e) { log('运行出错：' + errText(e), 'error'); });
  } else if (msg.type === 'cancel') {
    cancelled = true;
  } else if (msg.type === 'nodes') {
    if (nodesResolver) { const r = nodesResolver; nodesResolver = null; r(msg.nodes || []); }
  } else if (msg.type === 'done-ids') {
    if (doneResolver) { const r = doneResolver; doneResolver = null; r(msg.ids || []); }
  } else if (msg.type === 'ack') {
    if (ackResolve) { const r = ackResolve; ackResolve = null; ackReject = null; r(); }
  } else if (msg.type === 'nack') {
    if (ackReject) { const r = ackReject; ackResolve = null; ackReject = null; r(new Error(msg.text || 'batch failed')); }
  }
};
