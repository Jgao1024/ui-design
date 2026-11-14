import type { Child, Markup } from "@design/jsx/jsx-runtime";

/// A design page: a light sheet with a title and subtitle. Mock-ups sit on their own
/// backdrops; the page itself is never painted dark.
export function Page(props: { title: string; subtitle: string; children: Child }): Markup {
  return (
    <main class="min-h-screen bg-paper px-12 py-12 font-sans text-ink">
      <h1 class="text-2xl leading-8 font-bold">{props.title}</h1>
      <p class="mt-1 text-sm leading-5 text-dim">{props.subtitle}</p>
      {props.children}
    </main>
  );
}
