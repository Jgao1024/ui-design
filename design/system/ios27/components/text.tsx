import type { Child, Markup } from "@design/jsx/jsx-runtime";

// iOS text styles, from figma/reference/ios27/tokens/typography.json (SF Pro). Each entry is
// [size, line height, tracking, regular weight, emphasized weight]. Figma weights: 510 medium,
// 590 semibold.
export const TEXT_STYLES = {
  "large-title": [34, 41, 0.4, 400, 700],
  "title-1": [28, 34, 0.38, 400, 700],
  "title-2": [22, 28, -0.26, 400, 700],
  "title-3": [20, 25, -0.45, 400, 590],
  "headline": [17, 22, -0.43, 590, 590],
  "body": [17, 22, -0.43, 400, 590],
  "callout": [16, 21, -0.31, 400, 590],
  "subheadline": [15, 20, -0.23, 400, 590],
  "footnote": [13, 18, -0.08, 400, 590],
  "caption-1": [12, 16, 0, 400, 590],
  "caption-2": [11, 13, 0.06, 400, 590],
} as const;

export type TextStyle = keyof typeof TEXT_STYLES;

/// Inline CSS for a text style. `weight` overrides the style's own weight (e.g. 510 for buttons).
export function textCss(style: TextStyle, options: { emphasized?: boolean; weight?: number } = {}): string {
  const [size, leading, tracking, regular, emphasized] = TEXT_STYLES[style];
  const weight = options.weight ?? (options.emphasized ? emphasized : regular);
  return `font-size:${size}px;line-height:${leading}px;letter-spacing:${tracking}px;font-weight:${weight}`;
}

/// A line of text in an iOS text style.
export function Txt(props: {
  style: TextStyle;
  emphasized?: boolean;
  weight?: number;
  color?: string;
  class?: string;
  children?: Child;
}): Markup {
  const color = props.color ? `;color:${props.color}` : "";
  return (
    <span class={`block ${props.class ?? ""}`} style={textCss(props.style, props) + color}>{props.children}</span>
  );
}
