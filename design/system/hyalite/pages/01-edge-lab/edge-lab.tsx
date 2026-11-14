import type { Markup } from "@design/jsx/jsx-runtime";
import { HUD_CSS, Sliders } from "../../components/hud.tsx";
import { Scripts, Style } from "../../components/script.tsx";

// A replica of hyalite's demo/edge-lab.html (v0.5.0): three cards and three discs share one
// parameter set, one per bevel cross-section (circle / squircle / lip); the scope plots the lip
// disc. Markup and styles follow the original; the driver is client/edge-lab.js.

const CSS = `
html,body{margin:0;height:100%;overflow:hidden;background:#0b1016}
body{font:13px/1.45 system-ui,-apple-system,"PingFang SC",sans-serif;color:#eee}
#stage{position:absolute;inset:0;background-size:cover;background-position:center;overflow:hidden}
#stage.drop{outline:3px dashed rgba(255,255,255,.5);outline-offset:-8px}
.slot{position:absolute;top:12%;width:264px;touch-action:none;cursor:grab;user-select:none}
.slot.dragging{cursor:grabbing}
.slot:nth-of-type(1){left:27%} .slot:nth-of-type(2){left:51%} .slot:nth-of-type(3){left:75%}
.slot .tag{position:absolute;left:0;right:0;top:100%;margin-top:9px;text-align:center;
  font:11px/1.5 ui-monospace,Menlo,monospace;color:rgba(255,255,255,.8);text-shadow:0 1px 4px #000}
.glass{position:relative;box-sizing:border-box;border-radius:30px;padding:20px 22px;background:rgba(0,0,0,.13);
  backdrop-filter:var(--hyalite,blur(3px));-webkit-backdrop-filter:var(--hyalite,blur(3px));
  box-shadow:var(--hyalite-edge,none),0 16px 42px rgba(0,0,0,.36)}
.glass h3{margin:0 0 3px;font-size:17px;font-weight:600}
.glass p{margin:0;font-size:12px;opacity:.75}
.glass .bar{margin-top:14px;height:26px;border-radius:13px;background:rgba(255,255,255,.16)}
.glass .bar i{display:block;height:100%;width:52%;border-radius:13px;background:rgba(255,255,255,.8)}
.glass .sig{position:absolute;right:18px;bottom:6px;font:9.5px/1 ui-monospace,Menlo,monospace;font-style:normal;
  letter-spacing:.06em;color:rgba(255,255,255,.42)}
.dots{position:absolute;left:28%;top:52%;display:flex;gap:26px}
.dot{position:relative;width:132px;height:132px;border-radius:50%;box-sizing:border-box;display:grid;place-items:center;
  background:rgba(0,0,0,.05);backdrop-filter:var(--hyalite,blur(3px));-webkit-backdrop-filter:var(--hyalite,blur(3px));
  box-shadow:var(--hyalite-edge,none)}
.dot b{font:300 46px/1 system-ui;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.4)}
.dot i{position:absolute;bottom:-22px;font:11px/1 ui-monospace,Menlo,monospace;font-style:normal;
  color:rgba(255,255,255,.75);text-shadow:0 1px 4px #000}
#scope{position:absolute;z-index:20;right:16px;bottom:16px;width:330px;padding:11px 12px 9px;border-radius:12px;
  background:rgba(0,0,0,.72);border:1px solid rgba(255,255,255,.12);backdrop-filter:blur(12px)}
#scope h2{margin:0 0 7px;font:600 12px/1.2 system-ui,sans-serif;color:rgba(255,255,255,.9)}
#scope canvas{display:block;width:306px;border-radius:4px}
#curve{height:104px;background:#11161d}
#strip{height:30px;margin-top:6px;image-rendering:pixelated}
#scope .key{display:flex;gap:11px;margin-top:6px;font:10px/1.4 ui-monospace,Menlo,monospace;color:rgba(255,255,255,.62)}
#scope .key b{font-weight:400}
#scope .out{margin-top:5px;font:10px/1.5 ui-monospace,Menlo,monospace;color:rgba(255,255,255,.55)}
#hud{position:absolute;left:14px;top:12px}
#credit{position:fixed;z-index:30;left:50%;bottom:12px;transform:translateX(-50%);padding:5px 12px;border-radius:999px;
  background:rgba(0,0,0,.62);border:1px solid rgba(255,255,255,.12);font:11px/1.5 ui-monospace,Menlo,monospace;
  color:rgba(255,255,255,.72);text-decoration:none;white-space:nowrap}
#credit b{font-weight:600;color:#dfc174}
`;

const SHAPES = [
  { id: "g0", name: "circle", text: "四分之一圆，最陡" },
  { id: "g1", name: "squircle", text: "接平板接得更缓" },
  { id: "g2", name: "lip", text: "外凸内凹，多一组明暗带" },
];

export default function EdgeLab(): Markup {
  return (
    <>
      <Style css={HUD_CSS + CSS} />
      <div id="stage">
        {SHAPES.map((s) => (
          <div class="slot">
            <div class="glass" id={s.id}>
              <h3>{s.name}</h3><p>{s.text}</p><div class="bar"><i /></div><i class="sig">hyalite · VII-Cae (VII)</i>
            </div>
            <div class="tag">{s.name}</div>
          </div>
        ))}
        <div class="dots">
          {SHAPES.map((s, i) => <div class="dot" id={`d${i}`}><b>{i + 1}</b><i>{s.name}</i></div>)}
        </div>
      </div>

      <div id="hud">
        <h1 id="fold">剖面台</h1>
        <Sliders />
        <div class="btns">
          <button id="bg_test" class="on">测试底</button><button id="bg_stripe">条纹</button><button id="bg_grid">网格</button><button id="bg_dark">暗底</button>
          <label class="file">拖/选图<input type="file" id="pick" accept="image/*" /></label>
        </div>
        <div class="btns"><button id="reset">复位</button><button id="p_nofold">不折叠</button><button id="p_copy">抄参数</button></div>
        <div class="note" id="note">三种倒角剖面并排，同一组参数。示波器画的是 lip 那块。<br />玻璃可以拖动；拖张图进来当底。</div>
      </div>

      <div id="scope">
        <h2>剖面（外沿 → 内沿）· lip</h2>
        <canvas id="curve" width="612" height="208" />
        <canvas id="strip" width="306" height="30" />
        <div class="key"><b style="color:#7fcdcd">— 位移 m</b><b style="color:#ffb4a2">— 亮度 1+m′</b><b style="color:#dfc174">— 净剖面 E</b></div>
        <div class="out" id="out" />
      </div>

      <a id="credit" href="https://github.com/VII-Cae/hyalite--liquid-glass" target="_blank" rel="noopener"><b>hyalite</b> v0.5.0 · MIT © 2026 VII-Cae (VII)</a>
      <Scripts driver="edge-lab.js" />
    </>
  );
}
