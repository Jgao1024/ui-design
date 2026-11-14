#!/usr/bin/env node
// Minimal Chrome DevTools Protocol driver — zero dependencies (Node 22+ has global WebSocket).
//
//   node tools/chrome-cdp/cdp.mjs tabs
//   node tools/chrome-cdp/cdp.mjs shot /tmp/s1.png
//   node tools/chrome-cdp/cdp.mjs click 240 320
//   node tools/chrome-cdp/cdp.mjs key meta+a
//   node tools/chrome-cdp/cdp.mjs type "hello"
//   node tools/chrome-cdp/cdp.mjs eval "document.title"
//   node tools/chrome-cdp/cdp.mjs nav "https://…"
//   node tools/chrome-cdp/cdp.mjs size

import { writeFileSync } from 'node:fs';

const PORT = process.env.CDP_PORT || 9222;
const BASE = `http://127.0.0.1:${PORT}`;
const MATCH = process.env.CDP_MATCH || 'figma.com';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function listTargets() {
  const r = await fetch(`${BASE}/json/list`);
  return r.json();
}

async function pickTarget() {
  const pages = (await listTargets()).filter((t) => t.type === 'page');
  if (process.env.CDP_ID) {
    const byId = pages.find((p) => p.id.startsWith(process.env.CDP_ID));
    if (byId) return byId;
  }
  const matching = pages.filter((p) => p.url.includes(MATCH));
  return matching[matching.length - 1] || pages[0];
}

class CDP {
  constructor(ws) { this.ws = ws; this.seq = 0; this.pending = new Map(); }

  static async connect() {
    const t = await pickTarget();
    if (!t) throw new Error('no page target; is Chrome running with --remote-debugging-port?');
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.addEventListener('open', res, { once: true });
      ws.addEventListener('error', () => rej(new Error('ws connect failed')), { once: true });
    });
    const c = new CDP(ws);
    ws.addEventListener('message', (ev) => {
      let msg;
      try { msg = JSON.parse(ev.data); } catch { return; }
      const p = c.pending.get(msg.id);
      if (!p) return;
      c.pending.delete(msg.id);
      msg.error ? p.rej(new Error(msg.error.message)) : p.res(msg.result);
    });
    return c;
  }

  send(method, params = {}) {
    const id = ++this.seq;
    return new Promise((res, rej) => {
      this.pending.set(id, { res, rej });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async screenshot(path, beyond = false) {
    const { data } = await this.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: beyond });
    writeFileSync(path, Buffer.from(data, 'base64'));
    return path;
  }

  async key(combo) {
    const parts = combo.toLowerCase().split('+');
    const main = parts.pop();
    const mods = { meta: 4, alt: 1, ctrl: 2, shift: 8 };
    let modifiers = 0;
    for (const m of parts) modifiers |= mods[m] ?? 0;
    const SPECIAL = {
      '/': ['/', 'Slash', 191], '\\': ['\\', 'Backslash', 220], '[': ['[', 'BracketLeft', 219],
      ']': [']', 'BracketRight', 221], 'escape': ['Escape', 'Escape', 27], 'esc': ['Escape', 'Escape', 27],
      'enter': ['Enter', 'Enter', 13], 'return': ['Enter', 'Enter', 13], 'tab': ['Tab', 'Tab', 9],
      'backspace': ['Backspace', 'Backspace', 8], 'delete': ['Delete', 'Delete', 46],
      'up': ['ArrowUp', 'ArrowUp', 38], 'down': ['ArrowDown', 'ArrowDown', 40],
      'left': ['ArrowLeft', 'ArrowLeft', 37], 'right': ['ArrowRight', 'ArrowRight', 39],
      'space': [' ', 'Space', 32], '-': ['-', 'Minus', 189], '=': ['=', 'Equal', 187],
    };
    const sp = SPECIAL[main];
    const key = sp ? sp[0] : main;
    const code = sp ? sp[1] : (main.length === 1 ? `Key${main.toUpperCase()}` : main);
    const vk = sp ? sp[2] : (main.length === 1 ? main.toUpperCase().charCodeAt(0) : undefined);
    const common = { modifiers, key, code, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk };
    await this.send('Input.dispatchKeyEvent', { type: 'rawKeyDown', ...common });
    await this.send('Input.dispatchKeyEvent', { type: 'keyUp', ...common });
    await sleep(60);
  }

  async click(x, y, { double = false } = {}) {
    const base = { x, y, button: 'left', clickCount: 1, buttons: 1 };
    await this.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 });
    await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base });
    await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base, buttons: 0 });
    if (double) {
      await sleep(40);
      await this.send('Input.dispatchMouseEvent', { type: 'mousePressed', ...base, clickCount: 2 });
      await this.send('Input.dispatchMouseEvent', { type: 'mouseReleased', ...base, clickCount: 2, buttons: 0 });
    }
    await sleep(120);
  }

  async evaluate(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    return r.result?.value;
  }

  async info() {
    return {
      url: await this.evaluate('location.href'),
      title: await this.evaluate('document.title'),
      dpr: await this.evaluate('window.devicePixelRatio'),
      w: await this.evaluate('window.innerWidth'),
      h: await this.evaluate('window.innerHeight'),
    };
  }
}

const [cmd, ...args] = process.argv.slice(2);
const cdp = await CDP.connect();

switch (cmd) {
  case 'tabs': {
    for (const t of await listTargets()) {
      if (t.type === 'page') console.log(t.id.slice(0, 12), '|', t.title.slice(0, 40), '|', t.url.slice(0, 90));
    }
    break;
  }
  case 'shot': {
    const p = args[0] || '/tmp/shot.png';
    console.log(await cdp.screenshot(p, args[1] === 'full'), '←', await cdp.evaluate('location.href'));
    break;
  }
  case 'click': {
    await cdp.click(Number(args[0]), Number(args[1]), { double: args[2] === 'double' });
    console.log('clicked', args[0], args[1]);
    break;
  }
  case 'key': {
    await cdp.key(args[0]);
    console.log('key', args[0]);
    break;
  }
  case 'type': {
    await cdp.send('Input.insertText', { text: args.join(' ') });
    console.log('typed');
    break;
  }
  case 'eval': {
    console.log(JSON.stringify(await cdp.evaluate(args.join(' ')), null, 2));
    break;
  }
  case 'nav': {
    await cdp.send('Page.navigate', { url: args[0] });
    await sleep(1500);
    console.log('navigated');
    break;
  }
  case 'batch': {
    const steps = JSON.parse(args[0]);
    for (const st of steps) {
      switch (st.c) {
        case 'nav': await cdp.send('Page.navigate', { url: st.u }); await sleep(st.wait ?? 3000); break;
        case 'key': await cdp.key(st.k); break;
        case 'click': await cdp.click(st.x, st.y, { double: !!st.double }); break;
        case 'type': await cdp.send('Input.insertText', { text: st.t }); break;
        case 'eval': console.log('eval:', JSON.stringify(await cdp.evaluate(st.e))); break;
        case 'emulate':
          if (st.w === 0) { await cdp.send('Emulation.clearDeviceMetricsOverride'); }
          else { await cdp.send('Emulation.setDeviceMetricsOverride', { width: st.w, height: st.h, deviceScaleFactor: st.dpr ?? 2, mobile: false }); }
          await sleep(st.wait ?? 900); break;
        case 'shot': {
          const r = await cdp.screenshot(st.p, !!st.full);
          console.log('shot:', r);
          break;
        }
        case 'dl': await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: st.dir, eventsEnabled: true }); break;
        case 'wait': await sleep(st.ms); break;
        case 'scroll':
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: st.x, y: st.y, buttons: 0 });
          await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: st.x, y: st.y, deltaX: 0, deltaY: st.dy });
          await sleep(400); break;
        default: throw new Error('unknown step ' + st.c);
      }
    }
    console.log('batch done');
    break;
  }
  case 'dl': {
    const dir = args[0] || '/tmp/figma-dl';
    await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: dir, eventsEnabled: true });
    console.log('downloads ->', dir);
    break;
  }
  case 'fs': {
    const { windowId } = await cdp.send('Browser.getWindowForTarget');
    const state = args[0] || 'fullscreen';
    await cdp.send('Browser.setWindowBounds', { windowId, bounds: { windowState: state } });
    await sleep(1500);
    console.log('window state ->', state, 'inner:', await cdp.evaluate('innerWidth+"x"+innerHeight'));
    break;
  }
  case 'emulate': {
    if (args[0] === 'off') {
      await cdp.send('Emulation.clearDeviceMetricsOverride');
      console.log('emulation off');
      break;
    }
    const [w, h] = [Number(args[0]), Number(args[1])];
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: false });
    await sleep(1200);
    console.log('emulated viewport ->', await cdp.evaluate('innerWidth+"x"+innerHeight'));
    break;
  }
  case 'resize': {
    const [w, h] = [Number(args[0]), Number(args[1])];
    const { windowId } = await cdp.send('Browser.getWindowForTarget');
    await cdp.send('Browser.setWindowBounds', { windowId, bounds: { width: w, height: h } });
    await sleep(1200);
    console.log('window ->', w, 'x', h, 'inner:', await cdp.evaluate('innerWidth+"x"+innerHeight'));
    break;
  }
  case 'scroll': {
    const [x, y, dy] = [Number(args[0]), Number(args[1]), Number(args[2])];
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, buttons: 0 });
    await sleep(150);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: dy, modifiers: 0 });
    await sleep(150);
    await cdp.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: dy, modifiers: 0 });
    await sleep(400);
    console.log('scrolled', dy);
    break;
  }
  case 'front': {
    await cdp.send('Page.enable');
    await cdp.send('Page.bringToFront');
    console.log('brought to front');
    break;
  }
  case 'size':
  default: {
    console.log(await cdp.info());
  }
}
process.exit(0);
