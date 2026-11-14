import type { Child, Markup } from "@design/jsx/jsx-runtime";
import type { Mode } from "../theme.ts";
import { SCREEN } from "./chrome.tsx";

// Design-page layout for the Doubao kit: each screen is a row of four columns, Light prototype,
// Light device shot, Dark prototype, Dark device shot, so the copy can be checked side by side.

// Pages build to design/pages/doubao/<group>/<page>.html; three folders up is design/. The shots
// are gitignored and only exist on the Mac that captured them (docs/device-capture.md).
const REF = "../../../.ref/doubao/device";

export function DoubaoPage(props: { title: string; subtitle: string; children: Child }): Markup {
  return (
    <main class="min-h-screen bg-paper px-12 py-12 font-sans text-ink">
      <h1 class="text-2xl leading-8 font-bold">{props.title}</h1>
      <p class="mt-1 text-sm leading-5 text-dim">{props.subtitle}</p>
      {props.children}
    </main>
  );
}

function Column(props: { title: string; caption: string; children: Child }): Markup {
  return (
    <div class="row-span-3 grid grid-rows-subgrid">
      <h3 class="text-[15px] leading-5 font-semibold text-ink">{props.title}</h3>
      <p class="mt-[3px] text-xs leading-4 text-dim">{props.caption}</p>
      <div class="mt-3">{props.children}</div>
    </div>
  );
}

function Shot(props: { mode: Mode; name?: string }): Markup {
  if (!props.name) {
    return (
      <div class="grid place-items-center rounded-[55px] border border-dashed border-rule text-sm text-dim" style={`width:${SCREEN.width}px;height:${SCREEN.height}px`}>
        这一套没截到，原型按另一种外观推出
      </div>
    );
  }
  return <img src={`${REF}/${props.mode}/${props.name}.png`} width={SCREEN.width} height={SCREEN.height} class="rounded-[55px]" style={props.mode === "light" ? "box-shadow:0 0 0 1px #e5e5e5" : ""} alt="" />;
}

/// One screen: a heading, a one-line description, then the four columns. `light` and `dark` are
/// the device shot names (e.g. "02-sidebar"); leave one out when that mode was not captured.
export function ScreenSection(props: {
  title: string;
  description: string;
  light?: string;
  dark?: string;
  render: (mode: Mode) => Markup;
  notes?: string[];
}): Markup {
  return (
    <section class="mt-12 border-t border-rule pt-8">
      <h2 class="text-xl leading-7 font-bold">{props.title}</h2>
      <p class="mt-1 text-sm leading-5 text-dim">{props.description}</p>
      <div class="mt-6 grid grid-rows-[auto_auto_auto] gap-x-8" style={`grid-template-columns:repeat(4,${SCREEN.width}px)`}>
        <Column title="Light 原型" caption="">{props.render("light")}</Column>
        <Column title="Light 真机" caption={props.light ? `${props.light}.png` : "无"}><Shot mode="light" name={props.light} /></Column>
        <Column title="Dark 原型" caption="">{props.render("dark")}</Column>
        <Column title="Dark 真机" caption={props.dark ? `${props.dark}.png` : "无"}><Shot mode="dark" name={props.dark} /></Column>
      </div>
      {props.notes && props.notes.length > 0 && (
        <ul class="mt-6 list-disc pl-5 text-sm leading-6 text-dim">{props.notes.map((n) => <li>{n}</li>)}</ul>
      )}
    </section>
  );
}
