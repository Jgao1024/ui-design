// Driver for the component labs (pages/03-ios, pages/04-macos). Reads window.HL_CONFIG (presets,
// the platform's standard, the backdrops) from components/lab.tsx.
//   · two parameter sets, Light and Dark; each .hl-glass follows the set of its data-mode
//   · engine options re-attach that mode's glass (once per frame at most); fill / tone / shadow are
//     CSS variables and never rebuild a map
//   · background buttons repaint every .hl-stage that is not .hl-fixed
//   · "动画测试" slides every stage's backdrop for 3 s and reports the frame rate
(() => {
  const CFG = window.HL_CONFIG;
  const ENGINE = ['bevel', 'thickness', 'slope', 'shade', 'rim', 'edgeW', 'sat', 'edge', 'blur', 'dispersion', 'light', 'smooth'];
  const CSSKEYS = ['tone', 'fill', 'shadow'];
  const NUMS = ENGINE.concat(CSSKEYS);
  const MODES = ['light', 'dark'];
  const SAVE = 'ui-design.hyalite.lab.' + CFG.platform;
  const el = (id) => document.getElementById(id);
  const glass = { light: [], dark: [] };
  document.querySelectorAll('.hl-glass').forEach((g) => glass[g.dataset.mode].push(g));
  const stages = Array.from(document.querySelectorAll('.hl-stage'));
  const live = stages.filter((s) => !s.classList.contains('hl-fixed'));
  const ok = Hyalite.supported();

  const clone = (o) => JSON.parse(JSON.stringify(o));
  let state = clone(CFG.standard);
  try { const s = JSON.parse(localStorage.getItem(SAVE) || 'null'); if (s && s.light && s.dark) state = s; } catch (e) { /* ignore */ }
  let editing = 'light';
  const applied = { light: '', dark: '' };
  const pending = new Set();

  const engineOpts = (p) => { const o = { shape: p.shape, materialize: 0, settle: 0 }; ENGINE.forEach((k) => { o[k] = p[k]; }); return o; };

  function apply(mode) {
    const p = state[mode], root = document.documentElement.style;
    root.setProperty('--hl-tone-' + mode, p.tone);
    root.setProperty('--hl-fill-' + mode, p.fill);
    root.setProperty('--hl-shadow-' + mode, p.shadow);
    const o = engineOpts(p), key = JSON.stringify(o);
    if (!ok || key === applied[mode]) return;
    applied[mode] = key;
    glass[mode].forEach((g) => { Hyalite.detach(g); Hyalite.attach(g, o); });
  }
  function schedule(mode) {
    if (!pending.size) requestAnimationFrame(() => { pending.forEach(apply); pending.clear(); });
    pending.add(mode);
  }
  function save() { try { localStorage.setItem(SAVE, JSON.stringify(state)); } catch (e) { /* private mode */ } }

  /* ── panel ⇄ state ── */
  function showPanel() {
    const p = state[editing];
    el('shape').value = p.shape;
    NUMS.forEach((k) => { el(k).value = p[k]; el('v_' + k).textContent = p[k]; });
    MODES.forEach((m) => el('m_' + m).classList.toggle('on', m === editing));
  }
  function markPreset(id) {
    CFG.presets.forEach((p) => el('p_' + p.id).classList.toggle('on', p.id === id));
    const p = CFG.presets.find((x) => x.id === id);
    el('preset_note').textContent = p ? p.note : '';
  }
  NUMS.forEach((k) => el(k).addEventListener('input', () => {
    state[editing][k] = +el(k).value; el('v_' + k).textContent = el(k).value;
    markPreset(null); schedule(editing); save();
  }));
  el('shape').addEventListener('change', () => { state[editing].shape = el('shape').value; markPreset(null); schedule(editing); save(); });
  MODES.forEach((m) => { el('m_' + m).onclick = () => { editing = m; showPanel(); }; });
  CFG.presets.forEach((p) => {
    el('p_' + p.id).onclick = () => { state = { light: clone(p.light), dark: clone(p.dark) }; showPanel(); markPreset(p.id); MODES.forEach(schedule); save(); };
  });
  el('reset').onclick = () => { state = clone(CFG.standard); showPanel(); markPreset(null); MODES.forEach(schedule); save(); };
  el('p_copy').onclick = () => {
    const t = JSON.stringify(state);
    navigator.clipboard?.writeText(t).then(() => { el('note').textContent = '浅色 + 深色两套参数已复制，发给我写进 presets.ts 的 STANDARD。'; }, () => { el('note').textContent = t; });
  };
  el('fold').onclick = () => el('hud').classList.toggle('fold');

  /* ── backgrounds ── */
  const BG = Object.keys(CFG.backgrounds);
  function setBg(id, url) {
    live.forEach((s) => { s.style.background = url ? `#808080 url("${url}") center/cover` : CFG.backgrounds[id][s.dataset.mode]; });
    BG.forEach((b) => el('bg_' + b).classList.toggle('on', b === id));
  }
  BG.forEach((b) => { el('bg_' + b).onclick = () => setBg(b); });
  const loadFile = (f) => {
    if (!f || !/^image\//.test(f.type)) return;
    const r = new FileReader();
    r.onload = () => { setBg('file', r.result); el('note').textContent = '组件区底图已换成你的图（底色矩阵不变）。'; };
    r.readAsDataURL(f);
  };
  el('pick').onchange = (e) => loadFile(e.target.files[0]);
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); });

  /* ── frame rate ── */
  const count = glass.light.length + glass.dark.length;
  el('fps').textContent = `玻璃 ${count} 个 · 点上面按钮测帧率`;
  el('bench').onclick = () => {
    el('fps').textContent = '测试中…';
    let t0 = 0, last = 0, frames = 0, worst = 0;
    const step = (t) => {
      if (!t0) t0 = last = t;
      worst = Math.max(worst, t - last); last = t; frames++;
      const dx = Math.round(Math.sin((t - t0) / 300) * 24);
      stages.forEach((s) => { s.style.backgroundPosition = `${dx}px ${dx / 2}px`; });
      if (t - t0 < 3000) return requestAnimationFrame(step);
      stages.forEach((s) => { s.style.backgroundPosition = ''; });
      el('fps').textContent = `玻璃 ${count} 个 · ${Math.round(frames / ((t - t0) / 1000))} fps · 最长一帧 ${Math.round(worst)} ms`;
    };
    requestAnimationFrame(step);
  };

  /* ── start ── */
  if (!ok) el('note').innerHTML = '<span class="warn">这个浏览器不跑 SVG backdrop filter，只有 Chromium 能看到折射。</span>';
  showPanel();
  markPreset(null);
  MODES.forEach(apply);
})();
