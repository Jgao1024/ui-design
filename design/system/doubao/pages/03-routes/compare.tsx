import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { raw } from "@design/jsx/jsx-runtime";
import { LensGlass, displacementFilter, lensMapUrl, lensProfile } from "../../components/lens.tsx";

// Three implementation routes, same card, same backdrop. Only the plumbing differs:
//   A  backdrop-filter: url(#svg)  — the glass bends the live page behind it. Chromium only.
//   B  filter: url(#svg) on a copy — the glass bends a duplicated backdrop. Every engine.
//   C  a plain blur, for reference.
// Route 3 (WebGL shader) cannot be built into a static page and is only described in the table.

const GRID = {
  "background-image":
    "repeating-linear-gradient(0deg, rgb(255 255 255 / 0.34) 0 1px, transparent 1px 22px)," +
    "repeating-linear-gradient(90deg, rgb(255 255 255 / 0.34) 0 1px, transparent 1px 22px)," +
    "radial-gradient(circle at 62% 26%, #2f6bff 0 11%, transparent 40%)",
  "background-color": "#080d1c",
} as const;

const GRID_CSS = Object.entries(GRID).map(([key, value]) => `${key}:${value}`).join(";");

const CARD = { width: 380, height: 130, radius: 28 } as const;

let copies = 0;

function CopyGlass(props: { children?: Child }): Markup {
  // Route B: the card holds a copy of the backdrop and filters that copy instead of the page.
  // `overflow: hidden` on the card clips what the filter leaves over the rounded corners, and a
  // modest slab keeps the pixels the warp samples just outside the edge from turning into a halo.
  // A guard band keeps the warp off the outermost pixels: the copy ends at the card's box, so
  // anything sampling past it would hit transparency and leave a hard ring.
  const profile = lensProfile("squircle", 26, 44);
  const url = lensMapUrl(CARD.width, CARD.height, CARD.radius, profile, 0, 10);
  const id = `copy-${++copies}`;
  return (
    <div
      class="relative overflow-hidden"
      style={`width:${CARD.width}px;height:${CARD.height}px;border-radius:${CARD.radius}px;box-shadow:0 0 0 0.5px rgb(255 255 255 / 0.18),0 8px 28px rgb(0 0 0 / 0.18)`}
    >
      <svg aria-hidden="true" width="0" height="0" class="absolute">
        <filter id={id} filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" x="0" y="0" width="1" height="1" color-interpolation-filters="sRGB">
          {raw(displacementFilter(id, url, 2 * profile.max, 8))}
        </filter>
      </svg>
      {/* The stage tile paints its pattern from its own padding box, so the copy shifts by the
          same 40 px to land on the same pixels. */}
      <div class="absolute inset-0" style={`${GRID_CSS};background-position:-40px -40px;filter:url(#${id})`} />
      <div class="absolute inset-0" style="background:rgb(255 255 255 / 0.16)" />
      <div class="relative grid size-full place-items-center text-white" style="font-size:17px">{props.children}</div>
    </div>
  );
}

function BlurGlass(props: { children?: Child }): Markup {
  return (
    <div
      class="relative grid place-items-center text-white"
      style={`width:${CARD.width}px;height:${CARD.height}px;border-radius:${CARD.radius}px;background:rgb(255 255 255 / 0.16);backdrop-filter:blur(12px) saturate(1.6);box-shadow:0 0 0 0.5px rgb(255 255 255 / 0.18),0 8px 28px rgb(0 0 0 / 0.18);font-size:17px`}
    >
      {props.children}
    </div>
  );
}

/// A stage tile: the grid, a word big enough to read the warp in, then the card on top.
function Stage(props: { children: Child }): Markup {
  return (
    <div class="relative overflow-hidden" style={`${GRID_CSS};width:460px;height:210px;border-radius:20px`}>
      <span aria-hidden="true" class="absolute text-white/20" style="left:-8px;top:64px;font-size:150px;line-height:1;font-weight:700;letter-spacing:-0.04em">
        豆包
      </span>
      <div class="absolute" style="left:40px;top:40px">{props.children}</div>
    </div>
  );
}

function Panel(props: { title: string; caption: string; children: Child }): Markup {
  return (
    <div class="grid grid-rows-[auto_auto_auto]">
      <h3 class="text-[15px] leading-5 font-semibold text-ink">{props.title}</h3>
      <p class="mt-[3px] max-w-[380px] text-xs leading-4 text-dim">{props.caption}</p>
      <div class="mt-3">{props.children}</div>
    </div>
  );
}

const ROUTES = [
  {
    name: "A · backdrop-filter + SVG 位移",
    who: "hyalite / rdev / shuding / sohumsuthar（同一路线，贴图算法不同）",
    how: "浏览器把元素背后那一层当作 SourceGraphic 交给 SVG 滤镜，位移后直接贴上。",
    browsers: "只有 Chromium。Safari 丢掉整条声明，Firefox 从来没有。",
    cost: "每块玻璃一次滤镜求值；背后内容一动就要重算。元素多时是主要开销。",
    fidelity: "能做到真折射，中心不糊、边缘弯；保真度取决于贴图数学（SDF/Snell 比线性渐变准）。",
  },
  {
    name: "B · 复制一层背景，再 filter",
    who: "glisse（过滤内容本身）/ samasante 的 copy 模式 / dpawlikowski",
    how: "元素里放一份背景副本，用 filter: url() 弯的是副本的像素，再裁成玻璃形状。",
    browsers: "全浏览器，包括 iOS Safari。",
    cost: "多一层 DOM + 一份可见区域的重绘；副本要和真实背后内容对齐（固定壁纸免对齐）。",
    fidelity: "和 A 同级；但副本是静态的，滚动内容会「冻住」，字要单独放在上层。",
  },
  {
    name: "C · WebGL / WebGPU 着色器",
    who: "glass-ui / liquid-dom / dashersw（html2canvas 快照）/ naughtyduk",
    how: "把背后内容画进纹理，用 GLSL 做折射、色散、环境光，再合成回页面。",
    browsers: "全浏览器（WebGL2）；实时 DOM 要 Chrome 的 canvas-draw-element 实验特性。",
    cost: "最重：每帧一次纹理采样，还有一份快照或一次 DOM 光栅化。",
    fidelity: "上限最高（能做真 3D 厚度、接触阴影），但快照方案字会糊、滚动会滞后。",
  },
] as const;

export default function Routes(): Markup {
  return (
    <main class="min-h-screen bg-paper px-12 py-12 font-sans text-ink">
      <h1 class="text-2xl leading-8 font-bold">三条实现路线，同一张卡</h1>
      <p class="mt-1 max-w-[900px] text-sm leading-5 text-dim">
        前面提到的仓库听起来很多，其实只有三条路线：A 让浏览器弯「背后的真页面」，B 弯「一份背景副本」，C 用 WebGL 着色器。
        rdev、shuding、hyalite、sohumsuthar 都是 A，差别只在贴图数学。这一页把 A 和 B 放在同一张 380 × 130 的卡上对比。
      </p>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">一、同一张卡，三种画法</h2>
        <p class="mt-1 text-sm leading-5 text-dim">三块舞台是同一个网格图案，所以三张卡看到的是同一段背景。B 把这份背景重画在卡片里，再弯它自己的像素。</p>
        <div class="mt-6 flex items-start gap-10">
          <Panel title="C · 只有模糊（对照）" caption="blur(12px)。这就是今天原型里的样子。">
            <Stage>
              <BlurGlass>发消息或按住说话…</BlurGlass>
            </Stage>
          </Panel>
          <Panel title="A · backdrop-filter + 位移" caption="Chromium 独有。弯的是实时背景。">
            <Stage>
              <LensGlass mode="dark" width={CARD.width} height={CARD.height} radius={CARD.radius} kind="bar" fill="rgb(16 18 28 / 0.16)" class="grid place-items-center">
                <span style="font-size:17px;color:#fff">发消息或按住说话…</span>
              </LensGlass>
            </Stage>
          </Panel>
          <Panel title="B · 复制背景 + filter" caption="全浏览器。弯的是卡里那份副本。">
            <Stage>
              <CopyGlass>发消息或按住说话…</CopyGlass>
            </Stage>
          </Panel>
        </div>
      </section>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">二、三条路线的差异</h2>
        <div class="mt-6 overflow-hidden rounded-[14px] border border-rule">
          <table class="w-full border-collapse text-left text-sm leading-6">
            <thead>
              <tr class="bg-black/[0.03] text-ink">
                <th class="px-4 py-3 font-semibold">路线</th>
                <th class="px-4 py-3 font-semibold">代表</th>
                <th class="px-4 py-3 font-semibold">机制</th>
                <th class="px-4 py-3 font-semibold">浏览器</th>
                <th class="px-4 py-3 font-semibold">代价</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((route) => (
                <tr class="border-t border-rule align-top text-dim">
                  <td class="px-4 py-3 font-medium text-ink">{route.name}</td>
                  <td class="px-4 py-3">{route.who}</td>
                  <td class="px-4 py-3">{route.how}</td>
                  <td class="px-4 py-3">{route.browsers}</td>
                  <td class="px-4 py-3">{route.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ul class="mt-8 list-disc pl-5 text-sm leading-6 text-dim">
        <li>A 和 B 在 Chrome 里几乎一样——因为两边用的是同一张贴图，只差在「弯谁」。</li>
        <li>差别在别的引擎：Safari 只认 B；而在 Chrome 里 A 更省 DOM，B 每块玻璃多一层重绘。</li>
        <li>C（WebGL）这一页没法静态复现，它需要运行时 JS 去抓背景；要的话我单独做一页，带快照和实时 DOM 两种。</li>
      </ul>
    </main>
  );
}
