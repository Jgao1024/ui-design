import type { Markup } from "@design/jsx/jsx-runtime";
import { FONT_SANS } from "@design/theme.ts";
import type { TextStyle } from "../text-styles.ts";

const WEIGHT_NAME: Record<number, string> = { 400: "Regular", 500: "Medium", 510: "Medium", 590: "Semibold", 700: "Bold", 860: "Heavy" };
const FAMILY: Record<TextStyle["family"], string> = {
  "SF Pro": FONT_SANS,
  "SF Pro Rounded": 'ui-rounded,"SF Pro Rounded",system-ui,sans-serif',
  "Inter": 'Inter,system-ui,sans-serif',
};

/// One text style per row: its numbers in the left column, a sample set in that style on the right.
export function TextStyleList(props: { styles: TextStyle[] }): Markup {
  return (
    <div class="grid grid-cols-[240px_1fr] gap-x-8">
      {props.styles.map((style) => (
        <>
          <div class="border-b border-rule py-2">
            <p class="text-[13px] leading-4 font-semibold text-ink">
              {style.family} {WEIGHT_NAME[style.weight]} {style.weight}
            </p>
            <p class="mt-0.5 text-xs leading-4 text-dim">
              {style.size} / {style.lineHeight} · tracking {style.tracking} · {style.uses} uses
            </p>
          </div>
          <div class="flex items-center border-b border-rule py-2">
            <p
              class="whitespace-nowrap text-ink"
              style={`font-family:${FAMILY[style.family]};font-weight:${style.weight};font-size:${style.size}px;line-height:${style.lineHeight}px;letter-spacing:${style.tracking}px`}
            >
              Liquid Glass 0123456789
            </p>
          </div>
        </>
      ))}
    </div>
  );
}
