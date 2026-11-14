import type { Child, Markup } from "@design/jsx/jsx-runtime";

/// A row of variants that share tracks: titles on one line, captions on one line, mock-ups
/// starting at the same height, even when a caption is longer or missing.
/// `columns` is the number of variants; `width` is each column's width in px.
export function Row(props: { columns: number; width: number; children: Child }): Markup {
  return (
    <div
      class="grid grid-rows-[auto_auto_auto] gap-x-8 gap-y-0"
      style={`grid-template-columns:repeat(${props.columns},${props.width}px)`}
    >
      {props.children}
    </div>
  );
}

/// One variant in a `Row`: a title, a caption and the mock-up. Spans the row's three tracks.
export function Variant(props: { title: string; caption?: string; children: Child }): Markup {
  return (
    <div class="row-span-3 grid grid-rows-subgrid">
      <h3 class="text-[15px] leading-5 font-semibold text-ink">{props.title}</h3>
      <p class="mt-[3px] text-xs leading-4 text-dim">{props.caption ?? ""}</p>
      <div class="mt-3">{props.children}</div>
    </div>
  );
}
