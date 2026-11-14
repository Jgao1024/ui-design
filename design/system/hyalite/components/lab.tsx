import { type Child, type Markup, raw } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { PRESETS, STANDARD } from "../presets.ts";
import { GLASS_CSS } from "./glass.tsx";
import { HUD_CSS, Sliders } from "./hud.tsx";
import { Scripts, Style } from "./script.tsx";

// The component labs: a fixed parameter panel on the left, then one row per component family
// (name and note | Light stage | Dark stage), then the background matrix. Stages are `.hl-stage`;
// the panel's background buttons repaint every stage that is not `.hl-fixed`. client/lab.js runs it.

// Pages build to design/pages/hyalite/<group>/<page>.html; three folders up is design/.
const WALLPAPERS = "../../../.ref/wallpapers";

// Text behind glass: chat-like rows of mixed sizes, drawn once as an SVG tile.
const LINES = [
  ["把上周的销售数据整理成表格", 17, 600],
  ["按地区汇总，标出同比下降超过 10% 的门店", 15, 400],
  ["今天 14:32", 12, 400],
  ["好的，已整理成 3 张表：华东、华南、华北。", 15, 400],
  ["华东区 12 家门店里有 2 家同比下降。", 15, 400],
  ["Liquid Glass · 折射测试 Aa Bb 0123456789", 15, 500],
  ["设置 › 通用 › 关于本机", 17, 400],
  ["Wi-Fi、蓝牙、蜂窝网络、个人热点", 13, 400],
] as const;

function textTile(color: string, dim: string): string {
  let y = 26;
  const rows = LINES.map(([text, size, weight], i) => {
    const row = `<text x="16" y="${y}" font-family="-apple-system,PingFang SC,sans-serif" font-size="${size}" font-weight="${weight}" fill="${i % 3 === 2 ? dim : color}">${text}</text>`;
    y += size + 16;
    return row;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="${y}">${rows}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}") 0 0/420px ${y}px`;
}

// The wallpaper colours are the ios27 kit's demo wallpaper (decoration, not Figma values).
const GRADIENT = {
  light: "radial-gradient(circle at 18% 22%,#ff8a7a 0 16%,transparent 16.5%),radial-gradient(circle at 84% 78%,#ffd45e 0 14%,transparent 14.5%),radial-gradient(circle at 78% 18%,#5ee0a0 0 9%,transparent 9.5%),linear-gradient(135deg,#7ec8ff,#b79cff 55%,#ff9ad5)",
  dark: "radial-gradient(circle at 18% 22%,#c8483a 0 16%,transparent 16.5%),radial-gradient(circle at 84% 78%,#b88f1c 0 14%,transparent 14.5%),radial-gradient(circle at 78% 18%,#1f9a6a 0 9%,transparent 9.5%),linear-gradient(135deg,#0b1e4a,#2a1262 55%,#5a1148)",
};

export type BackgroundId = "white" | "grey1" | "grey2" | "grey3" | "black" | "gradient" | "photo" | "text" | "stripe";

/// Every backdrop, per mode. The matrix shows the first eight; the stripes are the refraction check.
export const BACKGROUNDS: { id: BackgroundId; label: string; css: Record<Mode, string> }[] = [
  { id: "white", label: "白", css: { light: "#ffffff", dark: "#ffffff" } },
  { id: "grey1", label: "浅灰", css: { light: "#f2f2f7", dark: "#f2f2f7" } },
  { id: "grey2", label: "中灰", css: { light: "#8e8e93", dark: "#8e8e93" } },
  { id: "grey3", label: "深灰", css: { light: "#1c1c1e", dark: "#1c1c1e" } },
  { id: "black", label: "黑", css: { light: "#000000", dark: "#000000" } },
  { id: "gradient", label: "彩色", css: GRADIENT },
  { id: "photo", label: "照片", css: { light: `#c98a5a url("${WALLPAPERS}/aerial.jpg") center/cover`, dark: `#2b2340 url("${WALLPAPERS}/sonoma.jpg") center/cover` } },
  { id: "text", label: "文字", css: { light: `${textTile("#1c1c1e", "#8e8e93")},#ffffff`, dark: `${textTile("#f2f2f7", "#8e8e93")},#000000` } },
  { id: "stripe", label: "条纹", css: { light: "repeating-linear-gradient(-75deg,#303030 0 12px,#8f8f8f 12px 24px)", dark: "repeating-linear-gradient(-75deg,#303030 0 12px,#8f8f8f 12px 24px)" } },
];

const DEFAULT_BG: BackgroundId = "gradient";
const bg = (id: BackgroundId, mode: Mode) => BACKGROUNDS.find((b) => b.id === id)!.css[mode];

/// A backdrop for mock-ups. `fixed` keeps it out of the panel's background switch (the matrix).
export function Stage(props: { mode: Mode; width: number; height: number; bg?: BackgroundId; fixed?: boolean; radius?: number; style?: string; class?: string; children?: Child }): Markup {
  return (
    <div
      class={`hl-stage relative overflow-hidden ${props.fixed ? "hl-fixed" : ""} ${props.class ?? ""}`}
      data-mode={props.mode}
      style={`width:${props.width}px;height:${props.height}px;border-radius:${props.radius ?? 20}px;background:${bg(props.bg ?? DEFAULT_BG, props.mode)};color:${props.mode === "light" ? "#000" : "#fff"};${props.style ?? ""}`}
    >
      {props.children}
    </div>
  );
}

const CSS = `
#hud{position:fixed;left:14px;top:12px}
#hud .tabs{display:grid;grid-template-columns:1fr 1fr;gap:4px}
#hud .tabs button{padding:4px 0}
#hud .preset-note{min-height:3.9em}
#hud .fps{margin-top:6px;font:10px/1.5 ui-monospace,Menlo,monospace;color:rgba(255,255,255,.7)}
.hl-page{padding-left:226px}
`;

const FILLS: Parameters<typeof Sliders>[0]["extra"] = [
  ["填充与阴影", [
    { id: "tone", label: "灰度", min: 0, max: 255, step: 1 },
    { id: "fill", label: "透明度", min: 0, max: 1, step: 0.01 },
    { id: "shadow", label: "阴影", min: 0, max: 1, step: 0.01 },
  ]],
];

function Panel(): Markup {
  return (
    <div id="hud">
      <h1 id="fold">玻璃参数</h1>
      <div class="sec">预设（浅色 + 深色一起换）</div>
      <div class="btns" style="margin-top:0">{PRESETS.map((p) => <button id={`p_${p.id}`}>{p.label}</button>)}</div>
      <div class="note preset-note" id="preset_note" />
      <div class="sec">正在调</div>
      <div class="tabs"><button id="m_light" class="on">浅色模式</button><button id="m_dark">深色模式</button></div>
      <label>形状<select id="shape"><option value="squircle">squircle</option><option value="circle">circle</option><option value="lip">lip</option></select><span /></label>
      <Sliders extra={FILLS} />
      <div class="sec">组件区底图</div>
      <div class="btns" style="margin-top:0">
        {BACKGROUNDS.map((b) => <button id={`bg_${b.id}`} class={b.id === DEFAULT_BG ? "on" : ""}>{b.label}</button>)}
        <label class="file">拖/选图<input type="file" id="pick" accept="image/*" /></label>
      </div>
      <div class="btns"><button id="reset">回到标准</button><button id="p_copy">定为标准（复制 JSON）</button></div>
      <div class="btns"><button id="bench">动画测试 3 秒</button></div>
      <div class="fps" id="fps" />
      <div class="note" id="note">参数按浅色 / 深色分两套保存，刷新后保留。</div>
    </div>
  );
}

/// Everything the driver needs from the build: presets, the platform's standard, the backdrops.
function Config(props: { platform: "ios" | "macos" }): Markup {
  const config = {
    platform: props.platform,
    presets: PRESETS,
    standard: STANDARD[props.platform],
    backgrounds: Object.fromEntries(BACKGROUNDS.map((b) => [b.id, b.css])),
  };
  return raw(`<script>window.HL_CONFIG=${JSON.stringify(config).replaceAll("<", "\\u003c")}</script>`);
}

export function LabPage(props: { platform: "ios" | "macos"; title: string; subtitle: string; children: Child }): Markup {
  return (
    <>
      <Style css={HUD_CSS + GLASS_CSS + CSS} />
      <Panel />
      <main class="hl-page min-h-screen bg-paper py-12 pr-12 font-sans text-ink">
        <div class="pl-12">
          <h1 class="text-2xl leading-8 font-bold">{props.title}</h1>
          <p class="mt-1 max-w-[900px] text-sm leading-5 text-dim">{props.subtitle}</p>
          {props.children}
        </div>
      </main>
      <Config platform={props.platform} />
      <Scripts driver="lab.js" />
    </>
  );
}

export function LabSection(props: { title: string; description: string; children: Child }): Markup {
  return (
    <section class="mt-12 border-t border-rule pt-8">
      <h2 class="text-xl leading-7 font-bold">{props.title}</h2>
      <p class="mt-1 text-sm leading-5 text-dim">{props.description}</p>
      <div class="mt-6">{props.children}</div>
    </section>
  );
}

/// One component family: name and note on the left, the Light and Dark stages side by side.
/// Rows share the column tracks, so every Light stage starts at the same x.
export function ComponentRows(props: { width: number; children: Child }): Markup {
  return (
    <div class="grid items-start gap-x-8 gap-y-10" style={`grid-template-columns:200px repeat(2,${props.width}px)`}>
      <span /><h3 class="text-[15px] leading-5 font-semibold">浅色模式</h3><h3 class="text-[15px] leading-5 font-semibold">深色模式</h3>
      {props.children}
    </div>
  );
}

export function ComponentRow(props: { title: string; note: string; width: number; height: number; render: (mode: Mode) => Child }): Markup {
  return (
    <>
      <div>
        <h3 class="text-[15px] leading-5 font-semibold">{props.title}</h3>
        <p class="mt-1 text-xs leading-4 text-dim">{props.note}</p>
      </div>
      {(["light", "dark"] as const).map((mode) => (
        <Stage mode={mode} width={props.width} height={props.height} class="grid place-items-center">{props.render(mode)}</Stage>
      ))}
    </>
  );
}

/// The same small sample on every backdrop, in both modes: the check that one parameter set works
/// on white, black, mid grey, colour, a photo and text.
export function Matrix(props: { width: number; height: number; render: (mode: Mode) => Child }): Markup {
  const shown = BACKGROUNDS.slice(0, 8);
  return (
    <div class="grid gap-x-3 gap-y-2" style={`grid-template-columns:80px repeat(${shown.length},${props.width}px)`}>
      <span />
      {shown.map((b) => <span class="text-xs leading-4 text-dim">{b.label}</span>)}
      {(["light", "dark"] as const).map((mode) => (
        <>
          <span class="self-center text-[13px] leading-5 font-semibold">{mode === "light" ? "浅色模式" : "深色模式"}</span>
          {shown.map((b) => (
            <Stage mode={mode} width={props.width} height={props.height} bg={b.id} fixed class="grid place-items-center">{props.render(mode)}</Stage>
          ))}
        </>
      ))}
    </div>
  );
}
