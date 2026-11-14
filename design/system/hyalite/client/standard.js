// Driver for pages/05-standard: no panel. Applies the standard (window.HL_STANDARD, from presets.ts)
// to every .hl-glass by its data-mode, and shows the notice where SVG backdrop filters do not run
// (every browser on iPhone and iPad is WebKit, which keeps only the blur).
(() => {
  const S = window.HL_STANDARD;
  const ENGINE = ['bevel', 'thickness', 'slope', 'shade', 'rim', 'edgeW', 'sat', 'edge', 'blur', 'dispersion', 'light', 'smooth'];
  const root = document.documentElement.style;
  const ok = Hyalite.supported();
  ['light', 'dark'].forEach((mode) => {
    const p = S[mode];
    root.setProperty('--hl-tone-' + mode, p.tone);
    root.setProperty('--hl-fill-' + mode, p.fill);
    root.setProperty('--hl-shadow-' + mode, p.shadow);
    if (!ok) return;
    const o = { shape: p.shape, materialize: 0, settle: 0 };
    ENGINE.forEach((k) => { o[k] = p[k]; });
    document.querySelectorAll(`.hl-glass[data-mode="${mode}"]`).forEach((g) => Hyalite.attach(g, o));
  });
  if (!ok) document.getElementById('hl-unsupported').hidden = false;
})();
