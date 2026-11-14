import { type Child, Markup, raw } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { GLASS_CSS } from "./glass.tsx";
import { BACKGROUNDS, type BackgroundId, Stage } from "./lab.tsx";
import * as ios from "./ios.tsx";
import * as mac from "./macos.tsx";
import { Scripts, Style } from "./script.tsx";
import { STANDARD } from "../presets.ts";

// The standard pages (pages/05-standard, pages/06-standard-macos): components with the standard
// glass, as one self-contained file to send around (e.g. to a phone): no panel, the engine and both
// wallpapers inlined, no external reference. Stages wrap to one column on a narrow screen and are
// scaled down to fit a phone.

const WALLPAPERS = new URL("../../../.ref/wallpapers/", import.meta.url);

function dataUrl(name: string): string {
  try {
    const bytes = Deno.readFileSync(new URL(name, WALLPAPERS));
    let text = "";
    for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return `url("data:image/jpeg;base64,${btoa(text)}")`;
  } catch {
    return "none"; // .ref/ is local to the Mac that made it; elsewhere the photo cells fall back to their colour
  }
}

// lab.tsx points the photo backdrop at ../../../.ref/wallpapers/*.jpg; here the same backdrop reads
// a variable holding the inlined image, so each picture is in the file once.
const PHOTOS = [["aerial.jpg", "--hl-aerial"], ["sonoma.jpg", "--hl-sonoma"]] as const;
const inlinePhotos = (html: string) =>
  PHOTOS.reduce((s, [file, name]) => s.replaceAll(`url(&quot;../../../.ref/wallpapers/${file}&quot;)`, `var(${name})`), html);

const CSS = `
:root{${PHOTOS.map(([file, name]) => `${name}:${dataUrl(file)}`).join(";")}}
@media (max-width:560px){.hl-ios .hl-fit{zoom:.84}.hl-mac .hl-fit{zoom:.74}}
`;

const MODES: { mode: Mode; label: string }[] = [{ mode: "light", label: "浅色模式" }, { mode: "dark", label: "深色模式" }];

type Item = { title: string; note: string; width: number; height: number; render: (mode: Mode) => Child };

const IOS: Item[] = [
  { title: "玻璃按钮", note: "44 / 50 符号按钮，Medium 34 和 Large 50 文字按钮，Prominent 蓝色玻璃。", width: 420, height: 170, render: (m) => <ios.Buttons mode={m} /> },
  { title: "工具栏", note: "402 x 54，返回按钮和两个符号的按钮组。", width: 420, height: 110, render: (m) => <ios.Toolbar mode={m} /> },
  { title: "Tab Bar", note: "290 x 62 的标签栏加 54 的搜索圆钮。", width: 420, height: 120, render: (m) => <ios.TabBar mode={m} /> },
  { title: "分段切换", note: "上：常态。下：拖动中，滑块变成玻璃透镜。", width: 420, height: 140, render: (m) => <ios.SegmentedControl mode={m} /> },
  { title: "开关", note: "关、开、按住（玻璃透镜）。", width: 420, height: 100, render: (m) => <ios.Switches mode={m} /> },
  { title: "滑块", note: "上：常态。下：拖动中。", width: 420, height: 130, render: (m) => <ios.Sliders mode={m} /> },
  { title: "搜索与输入框", note: "底部搜索栏，和“加号 + 输入框”的发消息栏。", width: 420, height: 160, render: (m) => <ios.SearchAndInput mode={m} /> },
  { title: "下拉菜单", note: "238 宽，40 pt 一行。", width: 420, height: 250, render: (m) => <ios.Menu mode={m} /> },
  { title: "Alert", note: "300 宽，圆角 34。", width: 420, height: 230, render: (m) => <ios.Alert mode={m} /> },
  { title: "Sheet", note: "Medium Sheet，四边内缩 6 pt。", width: 420, height: 300, render: (m) => <ios.Sheet mode={m} /> },
];

const MAC: Item[] = [
  { title: "窗口与侧边栏", note: "浮动玻璃侧边栏，工具栏玻璃胶囊。", width: 480, height: 340, render: (m) => <mac.WindowWithSidebar mode={m} /> },
  { title: "按钮", note: "36 高的工具栏按钮和文字胶囊；67 x 24 的按钮。", width: 480, height: 140, render: (m) => <mac.Buttons mode={m} /> },
  { title: "分段切换", note: "工具栏玻璃分段；内容区分段（实色）。", width: 480, height: 120, render: (m) => <mac.Segmented mode={m} /> },
  { title: "搜索与文本框", note: "工具栏玻璃搜索框；内容区文本框（实色）。", width: 480, height: 120, render: (m) => <mac.Fields mode={m} /> },
  { title: "下拉菜单", note: "244 宽，圆角 12，24 pt 一行。", width: 480, height: 200, render: (m) => <mac.Menu mode={m} /> },
  { title: "开关与复选框", note: "关、开、按住（玻璃胶囊）。", width: 480, height: 90, render: (m) => <mac.Toggles mode={m} /> },
  { title: "滑块", note: "上：常态。下：拖动中。", width: 480, height: 110, render: (m) => <mac.SliderRows mode={m} /> },
  { title: "Popover", note: "200 x 200，圆角 20。", width: 480, height: 250, render: (m) => <mac.Popover mode={m} /> },
  { title: "Alert", note: "260 宽，圆角 34。", width: 480, height: 290, render: (m) => <mac.Alert mode={m} /> },
];

function Component(props: { item: Item }): Markup {
  const it = props.item;
  return (
    <div class="mt-8">
      <h3 class="text-[15px] leading-5 font-semibold">{it.title}</h3>
      <p class="mt-1 text-xs leading-4 text-dim">{it.note}</p>
      <div class="mt-3 flex flex-wrap gap-4">
        {MODES.map(({ mode, label }) => (
          <div class="hl-fit">
            <div class="mb-1 text-xs leading-4 text-dim">{label}</div>
            <Stage mode={mode} width={it.width} height={it.height} bg="photo" class="grid place-items-center">{it.render(mode)}</Stage>
          </div>
        ))}
      </div>
    </div>
  );
}

/// The same small sample on all eight backdrops, wrapping on a narrow screen.
function Matrix(props: { sample: (mode: Mode) => Child }): Markup {
  return (
    <>
      {MODES.map(({ mode, label }) => (
        <div class="mt-4">
          <div class="text-[13px] leading-5 font-semibold">{label}</div>
          <div class="mt-2 flex flex-wrap gap-3">
            {BACKGROUNDS.slice(0, 8).map((b) => (
              <div>
                <div class="mb-1 text-xs leading-4 text-dim">{b.label}</div>
                <Stage mode={mode} width={170} height={120} bg={b.id as BackgroundId} class="grid place-items-center">{props.sample(mode)}</Stage>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function Platform(props: { id: string; title: string; items: Item[]; sample: (mode: Mode) => Child }): Markup {
  return (
    <section class={`${props.id} mt-12 border-t border-rule pt-8`}>
      <h2 class="text-xl leading-7 font-bold">{props.title}</h2>
      {props.items.map((item) => <Component item={item} />)}
      <h3 class="mt-10 text-[15px] leading-5 font-semibold">底色矩阵</h3>
      <p class="mt-1 text-xs leading-4 text-dim">同一组样本放在 8 种底上。</p>
      <Matrix sample={props.sample} />
    </section>
  );
}

export type PlatformId = "ios" | "macos";

const PLATFORMS: Record<PlatformId, Markup> = {
  ios: <Platform id="hl-ios" title="iOS 27" items={IOS} sample={(m) => <ios.Sample mode={m} />} />,
  macos: <Platform id="hl-mac" title="macOS 27" items={MAC} sample={(m) => <mac.Sample mode={m} />} />,
};

export function StandardPage(props: { title: string; platforms: PlatformId[] }): Markup {
  const page = (
    <>
      <Style css={GLASS_CSS + CSS} />
      <main class="mx-auto max-w-[1040px] bg-paper px-4 py-8 font-sans text-ink">
        <h1 class="text-2xl leading-8 font-bold">{props.title}</h1>
        <p class="mt-1 text-sm leading-5 text-dim">玻璃用 hyalite 实时折射（VII-Cae/hyalite--liquid-glass v0.5.0，MIT），参数是定下来的标准档（design/system/hyalite/presets.ts）。尺寸取自 Figma。单文件，不依赖任何外部资源。</p>
        <p id="hl-unsupported" hidden class="mt-3 rounded-[10px] bg-[#fff4e5] px-3 py-2 text-sm leading-5 text-[#8a5300]">这个浏览器不支持 SVG backdrop filter，看不到折射，只剩模糊。iPhone / iPad 上所有浏览器都是 WebKit 内核，都属于这种情况；请用电脑或安卓手机上的 Chrome / Edge 打开。</p>
        {props.platforms.map((p) => PLATFORMS[p])}
      </main>
      {raw(`<script>window.HL_STANDARD=${JSON.stringify(STANDARD.ios)}</script>`)}
      <Scripts driver="standard.js" />
    </>
  );
  return new Markup(inlinePhotos(page.html));
}
