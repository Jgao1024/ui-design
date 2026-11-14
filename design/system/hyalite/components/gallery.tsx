import { type Child, Markup, raw } from "@design/jsx/jsx-runtime";
import type { Mode } from "../../doubao/theme.ts";
import { GLASS_CSS } from "./glass.tsx";
import { type BackgroundId, Stage } from "./lab.tsx";
import { Scripts, Style } from "./script.tsx";
import { STANDARD } from "../presets.ts";

// A self-contained gallery page with the standard glass (pages/07-…, 08-…, 09-…): sections of items,
// each drawn in Light and Dark side by side. One file: the engine, the driver and both wallpapers
// are inlined. On a phone the stages wrap to one column and scale to fit the screen.
// Same build-time inlining as components/standard.tsx, kept separate so the existing pages stay as
// they are.

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

const PHOTOS = [["aerial.jpg", "--hl-aerial"], ["sonoma.jpg", "--hl-sonoma"]] as const;
const inlinePhotos = (html: string) =>
  PHOTOS.reduce((s, [file, name]) => s.replaceAll(`url(&quot;../../../.ref/wallpapers/${file}&quot;)`, `var(${name})`), html);

/// A phone is at least 360 pt wide; leave 16 pt of margin each side.
const PHONE = 361;

const CSS = `
:root{${PHOTOS.map(([file, name]) => `${name}:${dataUrl(file)}`).join(";")}}
@media (max-width:560px){.hl-fit{zoom:var(--fit,1)}}
`;

/// "plain" is the app background of each mode (white / black), for content that is not over a wallpaper.
export type ItemBackground = BackgroundId | "plain";

export type GalleryItem = {
  title: string;
  note: string;
  width: number;
  height: number;
  bg?: ItemBackground;
  render: (mode: Mode) => Child;
};

export type GallerySection = { title: string; description?: string; items: GalleryItem[] };

const MODES: { mode: Mode; label: string }[] = [{ mode: "light", label: "浅色模式" }, { mode: "dark", label: "深色模式" }];

function Item(props: { item: GalleryItem }): Markup {
  const it = props.item;
  const fit = it.width > PHONE ? `--fit:${(PHONE / it.width).toFixed(3)}` : "";
  return (
    <div class="mt-8">
      <h3 class="text-[15px] leading-5 font-semibold">{it.title}</h3>
      <p class="mt-1 text-xs leading-4 text-dim">{it.note}</p>
      <div class="mt-3 flex flex-wrap gap-4">
        {MODES.map(({ mode, label }) => {
          const bg = it.bg === "plain" ? (mode === "light" ? "white" : "black") : it.bg ?? "photo";
          // A white stage on the paper page needs an outline to show where it ends.
          const ring = it.bg === "plain" ? "box-shadow:0 0 0 1px rgb(0 0 0 / 0.08)" : "";
          return (
            <div class="hl-fit" style={fit}>
              <div class="mb-1 text-xs leading-4 text-dim">{label}</div>
              <Stage mode={mode} width={it.width} height={it.height} bg={bg} style={ring} class="grid place-items-center">{it.render(mode)}</Stage>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GalleryPage(props: { title: string; subtitle: string; sections: GallerySection[] }): Markup {
  const page = (
    <>
      <Style css={GLASS_CSS + CSS} />
      <main class="mx-auto max-w-[1040px] bg-paper px-4 py-8 font-sans text-ink">
        <h1 class="text-2xl leading-8 font-bold">{props.title}</h1>
        <p class="mt-1 text-sm leading-5 text-dim">{props.subtitle}</p>
        <p id="hl-unsupported" hidden class="mt-3 rounded-[10px] bg-[#fff4e5] px-3 py-2 text-sm leading-5 text-[#8a5300]">这个浏览器不支持 SVG backdrop filter，看不到折射，只剩模糊。iPhone / iPad 上所有浏览器都是 WebKit 内核，都属于这种情况；请用电脑或安卓手机上的 Chrome / Edge 打开。</p>
        {props.sections.map((s) => (
          <section class="mt-12 border-t border-rule pt-8">
            <h2 class="text-xl leading-7 font-bold">{s.title}</h2>
            {s.description && <p class="mt-1 text-sm leading-5 text-dim">{s.description}</p>}
            {s.items.map((item) => <Item item={item} />)}
          </section>
        ))}
      </main>
      {raw(`<script>window.HL_STANDARD=${JSON.stringify(STANDARD.ios)}</script>`)}
      <Scripts driver="standard.js" />
    </>
  );
  return new Markup(inlinePhotos(page.html));
}
