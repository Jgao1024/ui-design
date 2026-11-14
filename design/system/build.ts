// Renders every page in system/<kit>/pages/**.tsx to design/pages/<kit>/**.html and writes
// an index.html per kit and one overall. Run with `./build.sh [kit...]`, e.g. `./build.sh ios27`.
// With no argument every kit is built.

import type { Markup } from "./jsx/jsx-runtime.ts";
import { COLOR, FONT_MONO, FONT_SANS } from "./theme.ts";
import { compile } from "tailwindcss";

const KITS = ["ios27", "macos27", "doubao", "hyalite"];
// Kits whose pages run JavaScript in the browser (live parameter labs). Every other kit stays zero-JS.
const SCRIPTED_KITS = new Set(["hyalite"]);
const systemDirectory = new URL("./", import.meta.url);
const distDirectory = new URL("../pages/", import.meta.url);

await Deno.mkdir(distDirectory, { recursive: true });

const requested = Deno.args.length > 0 ? Deno.args : KITS;
for (const kit of requested) {
  if (!KITS.includes(kit)) throw new Error(`unknown kit "${kit}", expected one of: ${KITS.join(", ")}`);
}

const theme = await Deno.readTextFile(new URL(import.meta.resolve("tailwindcss/theme.css")));
const preflight = await Deno.readTextFile(new URL(import.meta.resolve("tailwindcss/preflight.css")));
const styles = await Deno.readTextFile(new URL("./styles.css", import.meta.url));

function toVariables(colors: Record<string, string>): string {
  return Object.entries(colors).map(([name, value]) => {
    const cssName = name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    return `--color-${cssName}:${value};`;
  }).join("\n");
}

async function stylesheetFor(kit: string): Promise<string> {
  const kitTheme = await import(new URL(`./${kit}/theme.ts`, systemDirectory).href);
  return `
@layer theme, base, components, utilities;
@layer theme { ${theme} }
@layer base { ${preflight} }
@theme { ${toVariables({ ...COLOR, ...kitTheme.COLOR })} --font-sans:${FONT_SANS}; --font-mono:${FONT_MONO}; }
${styles}
@tailwind utilities;
`;
}

async function* pageFiles(directory: URL, prefix = ""): AsyncGenerator<string> {
  const entries = [...Deno.readDirSync(directory)].sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isDirectory) {
      yield* pageFiles(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`);
    } else if (entry.isFile && entry.name.endsWith(".tsx")) {
      yield `${prefix}${entry.name.replace(/\.tsx$/, "")}`;
    }
  }
}

function unescapeAttribute(text: string): string {
  return text.replaceAll("&quot;", '"').replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("&amp;", "&");
}

for (const kit of requested) {
  const pagesDirectory = new URL(`./${kit}/pages/`, systemDirectory);
  const stylesheet = await stylesheetFor(kit);
  for await (const name of pageFiles(pagesDirectory)) {
    const module = await import(new URL(`${name}.tsx`, pagesDirectory).href);
    const page: () => Markup = module.default;
    const markup = page().html;
    const classes = [...markup.matchAll(/\bclass="([^"]*)"/g)].flatMap((match) =>
      unescapeAttribute(match[1]).split(/\s+/)
    );
    const compiler = await compile(stylesheet);
    const css = compiler.build(classes);
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${kit}/${name}</title>
<style>${css}</style>
<style>body{margin:0;background:${COLOR.paper}}svg{display:block}</style>
</head>
<body>
${markup}
</body>
</html>
`;
    // The output is static markup; JSX only runs here, at build time.
    if (!SCRIPTED_KITS.has(kit) && /<script\b|\son[a-z]+=/i.test(html)) {
      throw new Error(`${kit}/${name}: the built HTML must not contain JavaScript`);
    }
    const target = new URL(`./${kit}/${name}.html`, distDirectory);
    await Deno.mkdir(new URL("./", target), { recursive: true });
    await Deno.writeTextFile(target, html);
    console.log(`pages/${kit}/${name}.html`);
  }
}

await writeIndexes();

/// Lists every built page, grouped by kit and by group folder. Scans the output on disk, so
/// building one kit never drops the other kit's links.
async function writeIndexes(): Promise<void> {
  const sections: string[] = [];
  for (const kit of KITS) {
    const kitDirectory = new URL(`./${kit}/`, distDirectory);
    const found: string[] = [];
    try {
      for await (const name of htmlFiles(kitDirectory)) found.push(name);
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error;
    }
    const groups = new Map<string, string[]>();
    for (const name of found) {
      const group = name.includes("/") ? name.slice(0, name.lastIndexOf("/")) : "";
      groups.set(group, [...(groups.get(group) ?? []), name]);
    }
    const body = [...groups].map(([group, names]) =>
      `<h3>${group || "pages"}</h3><ul>${
        names.map((name) => `<li><a href="${kit}/${name}.html">${name.split("/").pop()}</a></li>`).join("")
      }</ul>`
    ).join("");
    sections.push(`<section><h2>${kit} <small>${found.length} pages</small></h2>${body || "<p>No pages yet.</p>"}</section>`);
  }
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Prototypes</title>
<style>body{font:14px/1.5 ${FONT_SANS};color:${COLOR.ink};background:${COLOR.paper};margin:40px auto;max-width:760px}
h2{border-top:1px solid ${COLOR.rule};padding-top:24px;margin-top:40px}small{color:${COLOR.dim};font-weight:400}
h3{margin:20px 0 4px;font-size:13px;color:${COLOR.dim}}ul{margin:0;padding-left:20px}a{color:${COLOR.ink}}</style></head>
<body><h1>Prototypes</h1>${sections.join("")}</body></html>
`;
  await Deno.writeTextFile(new URL("./index.html", distDirectory), html);
}

async function* htmlFiles(directory: URL, prefix = ""): AsyncGenerator<string> {
  const entries = [...Deno.readDirSync(directory)].sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.isDirectory) yield* htmlFiles(new URL(`${entry.name}/`, directory), `${prefix}${entry.name}/`);
    else if (entry.isFile && entry.name.endsWith(".html") && entry.name !== "index.html") {
      yield `${prefix}${entry.name.replace(/\.html$/, "")}`;
    }
  }
}
