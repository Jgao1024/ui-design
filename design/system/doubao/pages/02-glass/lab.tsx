import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../theme.ts";
import { tone } from "../../theme.ts";
import { HomeScreen } from "../../components/home.tsx";
import { InputBar, RoundButton, SCREEN } from "../../components/chrome.tsx";
import { GlassSurface } from "../../components/glass.tsx";
import { LensGlass } from "../../components/lens.tsx";

// The Liquid Glass trial run: the same Doubao home screen, drawn three ways.
//   · the device screenshot (ground truth)
//   · today's mock-up (measured frosting, no lensing)
//   · the same mock-up with the SDF lens in components/lens.tsx (Chromium only)

const REF = "../../../.ref/doubao/device";

// A stage that actually gives the glass something to bend: a hairline grid over a navy wash,
// with one blue light in the corner. Flat colour hides the lens completely.
const GRID =
  "background:repeating-linear-gradient(0deg,rgb(255 255 255 / 0.34) 0 1px,transparent 1px 22px)," +
  "repeating-linear-gradient(90deg,rgb(255 255 255 / 0.34) 0 1px,transparent 1px 22px)," +
  "radial-gradient(circle at 78% 22%,#2f6bff 0 18%,transparent 46%),#080d1c";

function Shot(props: { mode: Mode }): Markup {
  return (
    <img
      src={`${REF}/${props.mode}/01-home.png`}
      width={SCREEN.width}
      height={SCREEN.height}
      class="rounded-[55px]"
      style="box-shadow:0 0 0 1px #e5e5e5"
      alt=""
    />
  );
}

function Pair(props: { title: string; caption: string; children: Child }): Markup {
  return (
    <div class="grid grid-rows-[auto_auto_auto]">
      <h3 class="text-[15px] leading-5 font-semibold text-ink">{props.title}</h3>
      <p class="mt-[3px] max-w-[393px] text-xs leading-4 text-dim">{props.caption}</p>
      <div class="mt-3">{props.children}</div>
    </div>
  );
}

function Frame(props: { background: string; color?: string; children: Child }): Markup {
  return (
    <div
      class="relative overflow-hidden rounded-[55px]"
      style={`width:${SCREEN.width}px;height:${SCREEN.height}px;${props.background};color:${props.color ?? "#111"};box-shadow:0 0 0 1px #e5e5e5`}
    >
      {props.children}
    </div>
  );
}

const MENU_ROWS = ["对话", "工作任务", "模型", "豆包订阅"];

/// The 238 x 220 mode menu, as glass.
const STAGE_FILL = "rgb(18 20 30 / 0.22)";

function MenuCard(props: { mode: Mode; glass: "flat" | "lens" }): Markup {
  const t = tone(props.mode);
  const Glass = props.glass === "lens" ? LensGlass : GlassSurface;
  return (
    <div class="absolute left-[31px] top-[300px]">
      <Glass
        mode={props.mode}
        width={330}
        height={200}
        radius={28}
        kind="bar"
        floating
        class="flex flex-col px-[24px] pt-[14px]"
        fill={STAGE_FILL}
      >
        {MENU_ROWS.map((label, index) => (
          <>
            {index === 2 && <div class="my-[9px] h-px" style={`background:${t.divider}`} />}
            <div class="flex h-[40px] items-center gap-[10px]" style={`font-size:16px;color:${t.label}`}>
              <span class="flex-1">{label}</span>
              <span style={`color:${t.label3};font-size:15px`}>{index === 0 ? "当前" : ""}</span>
            </div>
          </>
        ))}
      </Glass>
    </div>
  );
}

function Stage(props: { mode: Mode; glass: "flat" | "lens" }): Markup {
  return (
    <Frame background={GRID} color="#fff">
      <div class="absolute left-3 top-[59px]"><RoundButton mode={props.mode} icon="menu" fill={STAGE_FILL} glass={props.glass} /></div>
      <div class="absolute left-[337px] top-[59px]"><RoundButton mode={props.mode} icon="voice" fill={STAGE_FILL} glass={props.glass} /></div>
      <MenuCard mode={props.mode} glass={props.glass} />
      <InputBar mode={props.mode} top={750} fill={STAGE_FILL} glass={props.glass} />
    </Frame>
  );
}

export default function GlassLab(): Markup {
  return (
    <main class="min-h-screen bg-paper px-12 py-12 font-sans text-ink">
      <h1 class="text-2xl leading-8 font-bold">豆包首页：换成真玻璃</h1>
      <p class="mt-1 text-sm leading-5 text-dim">
        左边是真机截图（豆包 iOS 15.6.0，iPhone 15 Pro），中间是现在的原型，右边是把玻璃换成 SDF 透镜后的原型。
        光、色、内容都在同一位置，只有玻璃这一层不一样。
      </p>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">一、同一屏，三种画法</h2>
        <p class="mt-1 text-sm leading-5 text-dim">
          豆包首页的背景是纯白，玻璃底下没有东西可以弯，所以这一排三种画法应该几乎一样——如果不一样，说明参数跑偏了。
        </p>
        <div class="mt-6 grid gap-x-8" style="grid-template-columns:repeat(3,393px)">
          <Pair title="真机" caption="design/.ref/doubao/device/light/01-home.png，3× 原图缩到 393 pt。">
            <Shot mode="light" />
          </Pair>
          <Pair title="现在的原型" caption="components/glass.tsx：测出来的 fill、rim 和阴影，只有模糊，没有折射。">
            <HomeScreen mode="light" />
          </Pair>
          <Pair title="换成 SDF 透镜" caption="components/lens.tsx：同一个盒子，多一层位移贴图。白底上两者应当几乎不可分辨。">
            <HomeScreen mode="light" glass="lens" />
          </Pair>
        </div>
      </section>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">二、舞台：给它内容，才看得出是玻璃</h2>
        <p class="mt-1 text-sm leading-5 text-dim">
          同一套组件，放到一张网格上：44 pt 圆钮、369 × 56 输入栏、238 × 220 菜单卡。左边只有模糊，右边是透镜。
          看三个地方：圆角外侧的网格线有没有被吸进来、栏体上下边缘有没有一道亮线、卡片的四个角是不是各自朝内弯。
        </p>
        <div class="mt-6 grid gap-x-8" style="grid-template-columns:repeat(2,393px)">
          <Pair title="现在" caption="blur(12px) + 测出来的 rim：网格只是变模糊，位置不动。">
            <Stage mode="dark" glass="flat" />
          </Pair>
          <Pair title="透镜" caption="blur(2px) 只用来消锯齿，弯折交给 SDF 贴图：网格在边缘朝内卷。">
            <Stage mode="dark" glass="lens" />
          </Pair>
        </div>
      </section>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">三、三种 bevel 截面</h2>
        <p class="mt-1 text-sm leading-5 text-dim">
          edge-lab 那页比的就是这条曲线：圆角处玻璃的横截面。circle 是四分之一圆，squircle 是 Apple 用的方圆形（边缘更早开始弯），lip 在边上先抬起来再凹下去，会多出一条反光带。
        </p>
        <div class="mt-6 flex gap-8">
          {(["circle", "squircle", "lip"] as const).map((shape) => (
            <div class="grid grid-rows-[auto_auto_auto]">
              <h3 class="text-[15px] leading-5 font-semibold text-ink">{shape}</h3>
              <p class="mt-[3px] text-xs leading-4 text-dim">
                {shape === "circle" ? "截面是四分之一圆，弯折集中在外沿" : shape === "squircle" ? "方圆形，弯折从更里面开始（推荐）" : "先抬后凹，边上多一圈光"}
              </p>
              <div class="mt-3 overflow-hidden rounded-[20px]" style={`width:300px;height:190px;${GRID}`}>
                <div class="pt-[20px] pl-[30px]">
                  <LensGlass mode="dark" width={240} height={150} radius={28} kind="bar" shape={shape} fill="rgb(16 18 28 / 0.18)" class="grid place-items-center">
                    <span style="font-size:15px;color:#fff">豆包</span>
                  </LensGlass>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section class="mt-12 border-t border-rule pt-8">
        <h2 class="text-xl leading-7 font-bold">四、输入栏左端，放大两倍</h2>
        <p class="mt-1 text-sm leading-5 text-dim">
          用 zoom 把同一段输入栏放大两倍（不是截图放大：模糊和位移都按 2 倍重新算）。看左边那个圆角：网格是整齐地变糊，还是被折进去、彼此错开。
        </p>
        <div class="mt-6 grid gap-x-8" style="grid-template-columns:repeat(2,786px)">
          <Pair title="现在" caption="圆角外侧的网格线保持笔直，只是对比度变低。">
            <div style={`zoom:2;width:393px;height:120px;overflow:hidden;position:relative;border-radius:16px;${GRID}`}>
              <InputBar mode="dark" top={32} fill={STAGE_FILL} glass="flat" />
            </div>
          </Pair>
          <Pair title="透镜" caption="同一位置：圆角内侧的线被拉宽、相位错开，边缘会亮一点。">
            <div style={`zoom:2;width:393px;height:120px;overflow:hidden;position:relative;border-radius:16px;${GRID}`}>
              <InputBar mode="dark" top={32} fill={STAGE_FILL} glass="lens" />
            </div>
          </Pair>
        </div>
      </section>

      <ul class="mt-8 list-disc pl-5 text-sm leading-6 text-dim">
        <li>透镜只在 Chromium 生效（backdrop-filter 里的 url()）。Safari 和 Firefox 会丢掉那条声明，退回现在这套模糊。</li>
        <li>第二、三节为了看得清位移，把模糊从 12 pt 压到 2 pt；真机上的模糊值还在 components/glass.tsx 里。</li>
        <li>贴图是构建期算好的 PNG，页面里没有一行 JS。</li>
      </ul>
    </main>
  );
}
