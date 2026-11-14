import { type Markup, raw } from "@design/jsx/jsx-runtime";

// Inlines browser code at build time, so each page stays one self-contained HTML file.
//   vendor/hyalite.js   the engine, byte for byte as published (MIT © 2026 VII-Cae (VII))
//   client/*.js         the drivers for this kit's pages

function inline(path: string): Markup {
  const code = Deno.readTextFileSync(new URL(`../${path}`, import.meta.url));
  if (/<\/script/i.test(code)) throw new Error(`${path} contains "</script" and cannot be inlined`);
  return raw(`<script>\n${code}\n</script>`);
}

/// The engine first, then the page's driver.
export function Scripts(props: { driver: string }): Markup {
  return raw(inline("vendor/hyalite.js").html + inline(`client/${props.driver}`).html);
}

/// Plain CSS for a page; JS-created nodes get no Tailwind classes, so the panels are styled here.
export function Style(props: { css: string }): Markup {
  return raw(`<style>${props.css}</style>`);
}
