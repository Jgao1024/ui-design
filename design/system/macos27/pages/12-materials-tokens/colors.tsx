import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";

// Tile backgrounds of the Figma swatch components (Colors___Swatch---*.json): Light #DDDDDD, Dark #111111.
const TILE = { light: "#dddddd", dark: "#111111" } as const;

/// A 160 x 80 tile with a 120 x 60 swatch, as in the Figma swatch components.
function Tile(props: { mode: "light" | "dark"; color: string; label?: string }): Markup {
  return (
    <div class="flex h-20 w-40 items-center justify-center rounded-[5px]" style={`background:${TILE[props.mode]}`}>
      {props.label
        ? <span class="text-[56px] leading-[60px] font-semibold" style={`color:${props.color}`}>{props.label}</span>
        : <div class="h-[60px] w-[120px]" style={`background:${props.color}`} />}
    </div>
  );
}

function Pair(props: { light: string; dark: string; label?: string }): Markup {
  return (
    <div class="flex gap-2">
      <Tile mode="light" color={props.light} label={props.label} />
      <Tile mode="dark" color={props.dark} label={props.label} />
    </div>
  );
}

// [name, Light, Dark, Light Vibrant, Dark Vibrant] from tokens/colors.json ("Colors / Swatch" and "Forms / Color=*").
// Blue has no vibrant pair in the token list.
const SYSTEM: [string, string, string, string?, string?][] = [
  ["Red", "#FF383C", "#FF4245", "#F52F32", "#FF4747"],
  ["Orange", "#FF8D28", "#FF9230", "#F58625", "#FF9E33"],
  ["Yellow", "#FFCC00", "#FFD600", "#F5C200", "#FFE014"],
  ["Green", "#34C759", "#30D158", "#26BF4D", "#3BDB63"],
  ["Mint", "#00C8B3", "#00DAC3", "#00BDA9", "#2DE0CD"],
  ["Teal", "#00C3D0", "#00D2E0", "#00B3BF", "#2DD7E0"],
  ["Cyan", "#00C0E8", "#3CD3FE", "#00ABCF", "#47D8FC"],
  ["Blue", "#0088FF", "#0091FF"],
  ["Indigo", "#6155F5", "#6D7CFF", "#5C50E6", "#7163FF"],
  ["Purple", "#CB30E0", "#DB34F2", "#B72BC9", "#E647FC"],
  ["Pink", "#FF2D55", "#FF375F", "#F5234B", "#FF4169"],
  ["Brown", "#AC7F5E", "#B78A66", "#9E7354", "#C29672"],
  ["Gray", "#8E8E93", "#98989F"],
];

function Chip(props: { mode: "light" | "dark"; hex?: string }): Markup {
  if (!props.hex) return <div class="h-10 w-32" />;
  return (
    <div>
      <div class="flex h-10 w-32 items-center justify-center rounded-[5px]" style={`background:${TILE[props.mode]}`}>
        <div class="h-7 w-24" style={`background:${props.hex}`} />
      </div>
      <p class="mt-0.5 text-[11px] leading-4 text-dim">{props.hex}</p>
    </div>
  );
}

export default function Colors(): Markup {
  return (
    <Page title="Colors" subtitle="macOS 27 · Figma page Colors">
      <Section title="Swatch components" description="The four swatch templates on the Figma page, drawn with its red example. Each has a Light and a Dark tile." gap={12}>
        <Row columns={2} width={328}>
          <Variant title="Light and Dark" caption="Red · Light #FF383C, Dark #FF4245.">
            <Pair light="#FF383C" dark="#FF4245" />
          </Variant>
          <Variant title="Light and Dark (Vibrant)" caption="Red · Light #F52F32, Dark #FF4747. Over a vibrancy layer (saturation + luminosity).">
            <Pair light="#F52F32" dark="#FF4747" />
          </Variant>
        </Row>
        <Row columns={2} width={328}>
          <Variant title="Text" caption="Label · Light #000000 85%, Dark #FFFFFF 85%. The glyph shape is a vector in Figma; Aa stands in.">
            <Pair light="rgb(0 0 0 / 0.85)" dark="rgb(255 255 255 / 0.85)" label="Aa" />
          </Variant>
          <Variant title="Text (Vibrant)" caption="Light #1A1A1A, Dark #F5F5F5.">
            <Pair light="#1A1A1A" dark="#F5F5F5" label="Aa" />
          </Variant>
        </Row>
      </Section>

      <Section title="System colors" description="Hex values from the colour tokens, one row per colour. Blue and Gray have no vibrant pair in the tokens." gap={10}>
        <div class="grid grid-cols-[80px_repeat(4,128px)] gap-x-4 gap-y-2">
          <span />
          <h3 class="text-xs font-semibold">Light</h3>
          <h3 class="text-xs font-semibold">Dark</h3>
          <h3 class="text-xs font-semibold">Light Vibrant</h3>
          <h3 class="text-xs font-semibold">Dark Vibrant</h3>
          {SYSTEM.map(([name, light, dark, lightVibrant, darkVibrant]) => (
            <>
              <span class="self-start pt-3 text-[13px] font-semibold">{name}</span>
              <Chip mode="light" hex={light} />
              <Chip mode="dark" hex={dark} />
              <Chip mode="light" hex={lightVibrant} />
              <Chip mode="dark" hex={darkVibrant} />
            </>
          ))}
        </div>
      </Section>
    </Page>
  );
}
