import type { Markup } from "@design/jsx/jsx-runtime";

// The parameter panel shared by every hyalite page: the slider ranges and the dark HUD styling of
// hyalite's demo/edge-lab.html. Sliders get no `value`; each driver fills them from saved values or
// Hyalite.DEFAULTS on load.

export type Slider = { id: string; label: string; min: number; max: number; step: number };

export const SLIDERS: [string, Slider[]][] = [
  ["几何", [
    { id: "bevel", label: "倒角", min: 4, max: 200, step: 1 },
    { id: "thickness", label: "厚度", min: 0, max: 220, step: 1 },
    { id: "slope", label: "斜率", min: 0.3, max: 4, step: 0.05 },
  ]],
  ["边缘", [
    { id: "shade", label: "暗", min: 0, max: 2, step: 0.02 },
    { id: "rim", label: "反光", min: 0, max: 4, step: 0.02 },
    { id: "edgeW", label: "边宽", min: 0.5, max: 40, step: 0.5 },
    { id: "sat", label: "饱和", min: 0, max: 2, step: 0.02 },
    { id: "edge", label: "外描边", min: 0, max: 2, step: 0.02 },
  ]],
  ["通用", [
    { id: "blur", label: "模糊", min: 0, max: 14, step: 0.25 },
    { id: "dispersion", label: "色散", min: 0, max: 8, step: 0.05 },
    { id: "light", label: "光向", min: -180, max: 180, step: 5 },
    { id: "smooth", label: "smooth", min: 0, max: 4, step: 0.25 },
  ]],
];

export const HUD_CSS = `
#hud{z-index:20;width:212px;max-height:calc(100% - 24px);overflow:auto;box-sizing:border-box;
  display:flex;flex-direction:column;gap:4px;padding:10px 11px;border-radius:11px;
  background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(12px);
  font:11px/1.3 ui-monospace,Menlo,monospace;color:rgba(255,255,255,.85)}
#hud h1{margin:0 0 3px;font:600 12px/1.2 system-ui,sans-serif;cursor:pointer;user-select:none}
#hud h1::after{content:' ▾';opacity:.5}
#hud.fold h1::after{content:' ▸'}
#hud.fold>:not(h1){display:none}
#hud .sec{margin:5px 0 0;font:600 10px/1.4 system-ui,sans-serif;color:#dfc174;letter-spacing:.04em}
#hud label{display:grid;grid-template-columns:50px 1fr 32px;align-items:center;gap:6px}
#hud label>span:last-child{text-align:right;font-size:10px;opacity:.75}
#hud input[type=range]{width:100%;min-width:0;accent-color:#dfc174;height:13px;margin:0}
#hud select{width:100%;min-width:0;font:10px/1.3 ui-monospace,Menlo,monospace;background:rgba(255,255,255,.1);color:inherit;
  border:1px solid rgba(255,255,255,.18);border-radius:5px;padding:1px 2px}
#hud .btns{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}
#hud button,#hud .file{font:10px/1.2 ui-monospace,Menlo,monospace;padding:3px 6px;border-radius:6px;
  border:1px solid rgba(255,255,255,.18);white-space:nowrap;background:rgba(255,255,255,.1);color:inherit;cursor:pointer}
#hud button:hover,#hud .file:hover{background:rgba(255,255,255,.2)}
#hud button.on{background:#dfc174;color:#1b1f1a;border-color:#dfc174}
#hud input[type=file]{display:none}
#hud .note{margin-top:5px;font:9.5px/1.4 system-ui,sans-serif;color:rgba(255,255,255,.5)}
#hud .warn{color:#ffb4a2}
`;

function Range(props: Slider): Markup {
  return (
    <label>{props.label}<input type="range" id={props.id} min={props.min} max={props.max} step={props.step} /><span id={`v_${props.id}`} /></label>
  );
}

/// Section headings and sliders. `extra` adds sections after hyalite's own (e.g. the glass fills).
export function Sliders(props: { extra?: [string, Slider[]][] }): Markup {
  return (
    <>
      {[...SLIDERS, ...(props.extra ?? [])].map(([section, items]) => (
        <>
          <div class="sec">{section}</div>
          {items.map((s) => <Range {...s} />)}
        </>
      ))}
    </>
  );
}
