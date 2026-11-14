// Driver for pages/02-home: attaches every .hl-glass to hyalite, wires the panel to the engine
// (Hyalite.setOpts) and to the two fill variables, and swaps what is behind the phone screens.
// The test / stripe / grid backgrounds are the ones drawn by hyalite's edge-lab.
(() => {
  const KEYS = ['bevel', 'thickness', 'slope', 'shade', 'rim', 'edgeW', 'sat', 'edge', 'blur', 'dispersion', 'light', 'smooth'];
  const FILLS = ['fillLight', 'fillDark'];
  const DEFAULTS = Object.assign({}, Hyalite.DEFAULTS, { fillLight: 0.5, fillDark: 0.12 });
  const SAVE = 'ui-design.hyalite.home';
  const el = (id) => document.getElementById(id);
  const glasses = Array.from(document.querySelectorAll('.hl-glass'));
  const screens = Array.from(document.querySelectorAll('.hl-screen'));

  const read = () => {
    const o = { shape: el('shape').value };
    KEYS.concat(FILLS).forEach((k) => { o[k] = +el(k).value; });
    return o;
  };
  const write = (o) => {
    if (o.shape) el('shape').value = o.shape;
    KEYS.concat(FILLS).forEach((k) => { if (o[k] != null) el(k).value = o[k]; });
  };
  const engineOpts = (o) => {
    const e = { shape: o.shape };
    KEYS.forEach((k) => { e[k] = o[k]; });
    return e;
  };

  function render() {
    const o = read();
    KEYS.concat(FILLS).forEach((k) => { el('v_' + k).textContent = el(k).value; });
    document.documentElement.style.setProperty('--hl-fill-light', o.fillLight);
    document.documentElement.style.setProperty('--hl-fill-dark', o.fillDark);
    if (Hyalite.supported()) Hyalite.setOpts(engineOpts(o));
    try { localStorage.setItem(SAVE, JSON.stringify(o)); } catch (e) { /* private mode */ }
  }

  /* ── backgrounds (canvas art from hyalite's edge-lab) ── */
  function testBg() {
    const c = document.createElement('canvas'); c.width = 1400; c.height = 900;
    const x = c.getContext('2d');
    const gr = x.createLinearGradient(0, 0, 1400, 900);
    gr.addColorStop(0, '#12304f'); gr.addColorStop(.5, '#7b2d5e'); gr.addColorStop(1, '#1d5c4e');
    x.fillStyle = gr; x.fillRect(0, 0, 1400, 900);
    ['#ff4d6d', '#ffd166', '#06d6a0', '#4cc9f0', '#ffffff', '#0a0a0a'].forEach((col, i) => { x.fillStyle = col; x.fillRect(90 + i * 210, 120, 150, 300); });
    x.fillStyle = 'rgba(255,255,255,.85)';
    for (let i = 0; i < 26; i++) x.fillRect(60, 470 + i * 16, 1280, 2);
    x.fillStyle = '#fff'; x.font = '800 130px system-ui'; x.fillText('THICK', 420, 830);
    return c.toDataURL('image/png');
  }
  function stripeBg() {
    const c = document.createElement('canvas'); c.width = 1200; c.height = 900;
    const x = c.getContext('2d');
    x.fillStyle = '#8f8f8f'; x.fillRect(0, 0, 1200, 900);
    x.save(); x.translate(600, 450); x.rotate(-0.22); x.translate(-600, -450);
    x.fillStyle = '#303030';
    for (let i = -700; i < 1900; i += 24) x.fillRect(i, -400, 12, 1700);
    x.restore();
    return c.toDataURL('image/png');
  }
  function gridBg() {
    const c = document.createElement('canvas'); c.width = 800; c.height = 800;
    const x = c.getContext('2d'); x.fillStyle = '#1d2a1f'; x.fillRect(0, 0, 800, 800);
    x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1;
    for (let i = 0; i <= 800; i += 12) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 800); x.moveTo(0, i); x.lineTo(800, i); x.stroke(); }
    return c.toDataURL('image/png');
  }
  const BG = ['flat', 'test', 'stripe', 'grid'];
  function setBg(which, url) {
    screens.forEach((s) => {
      s.style.backgroundImage = url ? `url("${url}")` : '';
      s.style.backgroundSize = which === 'grid' ? '800px 800px' : '';
    });
    BG.forEach((b) => el('bg_' + b).classList.toggle('on', b === which));
  }
  el('bg_flat').onclick = () => setBg('flat');
  el('bg_test').onclick = () => setBg('test', testBg());
  el('bg_stripe').onclick = () => setBg('stripe', stripeBg());
  el('bg_grid').onclick = () => setBg('grid', gridBg());
  const loadFile = (f) => {
    if (!f || !/^image\//.test(f.type)) return;
    const r = new FileReader();
    r.onload = () => { setBg('file', r.result); el('note').textContent = '底图已换成你的图。'; };
    r.readAsDataURL(f);
  };
  el('pick').onchange = (e) => loadFile(e.target.files[0]);
  addEventListener('dragover', (e) => e.preventDefault());
  addEventListener('drop', (e) => { e.preventDefault(); loadFile(e.dataTransfer.files[0]); });

  /* ── buttons ── */
  el('reset').onclick = () => { write(DEFAULTS); render(); };
  el('p_copy').onclick = () => {
    const t = JSON.stringify(read());
    navigator.clipboard?.writeText(t).then(() => { el('note').textContent = '参数已复制到剪贴板'; }, () => { el('note').textContent = t; });
  };
  el('fold').onclick = () => el('hud').classList.toggle('fold');
  KEYS.concat(FILLS).forEach((k) => el(k).addEventListener('input', render));
  el('shape').addEventListener('change', render);

  /* ── start ── */
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(SAVE) || 'null'); } catch (e) { /* ignore */ }
  write(Object.assign({}, DEFAULTS, saved || {}));
  if (Hyalite.supported()) {
    const o = engineOpts(read());
    glasses.forEach((g) => Hyalite.attach(g, Object.assign({}, o, { materialize: 0, settle: 0 })));
  } else {
    el('note').innerHTML = '<span class="warn">这个浏览器不跑 SVG backdrop filter，只有 Chromium 能看到折射。</span>';
  }
  render();
})();
