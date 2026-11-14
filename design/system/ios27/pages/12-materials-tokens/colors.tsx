import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ACCENT, type Mode, tone } from "../../theme.ts";

const NAMES = Object.keys(ACCENT.light) as (keyof typeof ACCENT.light)[];

/// Figma's Swatch: a 100 x 100 tile with an 80 x 80 circle, Light on white, Dark on black.
function Swatch(props: { mode: Mode; color: string }): Markup {
  const dark = props.mode === "dark";
  return (
    <div class="grid size-[100px] place-items-center rounded-[16px]" style={`background:${dark ? "#000" : "#fff"};box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.12)`}>
      <div class="size-20 rounded-full" style={`background:${props.color}`} />
    </div>
  );
}

function Pair(props: { light: string; dark: string }): Markup {
  return (
    <div class="flex gap-4">
      <Swatch mode="light" color={props.light} />
      <Swatch mode="dark" color={props.dark} />
    </div>
  );
}

const upper = (hex: string) => hex.toUpperCase();

const LABELS = [
  ["Primary", "label"],
  ["Secondary", "label2"],
  ["Tertiary", "label3"],
  ["Quaternary", "label4"],
] as const;

const FILLS = [
  ["Fill", "fill"],
  ["Secondary fill", "fill2"],
  ["Tertiary fill", "fill3"],
  ["Quaternary fill", "fill4"],
] as const;

/// A tile that shows a translucent colour over the mode's background.
function Tile(props: { mode: Mode; color: string; text?: boolean }): Markup {
  const t = tone(props.mode);
  return (
    <div class="grid h-20 w-[216px] place-items-center rounded-[16px]" style={`background:${t.bg};box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.12)`}>
      <div class="grid h-14 w-44 place-items-center rounded-[10px] text-[17px] font-semibold" style={props.text ? `color:${props.color}` : `background:${props.color}`}>
        {props.text ? "Label" : ""}
      </div>
    </div>
  );
}

const BACKGROUNDS = [
  ["Light", "light", ["bg", "bg2", "bg3"]],
  ["Dark, base", "dark", ["bg", "bg2", "bg3"]],
  ["Dark, elevated", "dark", ["bg2", "bg3", "#3a3a3c"]],
] as const;

export default function Colors(): Markup {
  return (
    <Page title="Colors" subtitle="iOS 27 colours. Source: figma/reference/ios27/specs/08-tokens/Colors__*.json and tokens/colors.json">
      <Section title="System colours" description="Each tile pairs the Light colour on white with the Dark colour on black. Figma swatch: 100 x 100 tile, 80 x 80 circle." gap={10}>
        {[0, 4, 8, 12].map((start) => (
          <Row columns={4} width={216}>
            {NAMES.slice(start, start + 4).map((name) => (
              <Variant title={name[0].toUpperCase() + name.slice(1)} caption={`Light ${upper(ACCENT.light[name])}, Dark ${upper(ACCENT.dark[name])}`}>
                <Pair light={ACCENT.light[name]} dark={ACCENT.dark[name]} />
              </Variant>
            ))}
          </Row>
        ))}
      </Section>

      <Section title="Labels" description="Text colours. Light #3C3C43 and Dark #EBEBF5 at 60, 30 and 18 %; primary is black or white." gap={10}>
        <Row columns={4} width={216}>
          {LABELS.map(([title, key]) => (
            <Variant title={title} caption={`Light ${tone("light")[key]}, Dark ${tone("dark")[key]}`}>
              <div class="flex gap-4">
                <Tile mode="light" color={tone("light")[key]} text />
              </div>
            </Variant>
          ))}
        </Row>
        <Row columns={4} width={216}>
          {LABELS.map(([title, key]) => (
            <Variant title={`${title}, Dark`}>
              <Tile mode="dark" color={tone("dark")[key]} text />
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Fills" description="Fills for controls and grouped content. Light #787880 at 20, 16, 12 and 8 %; Dark at 36, 32, 24 and 18 %." gap={10}>
        <Row columns={4} width={216}>
          {FILLS.map(([title, key]) => (
            <Variant title={title} caption={`Light ${tone("light")[key]}`}>
              <Tile mode="light" color={tone("light")[key]} />
            </Variant>
          ))}
        </Row>
        <Row columns={4} width={216}>
          {FILLS.map(([title, key]) => (
            <Variant title={`${title}, Dark`} caption={`Dark ${tone("dark")[key]}`}>
              <Tile mode="dark" color={tone("dark")[key]} />
            </Variant>
          ))}
        </Row>
      </Section>

      <Section title="Backgrounds" description="Primary, secondary and tertiary. Light #FFFFFF, #F2F2F7, #FFFFFF. Dark base #000000, #1C1C1E, #2C2C2E. Dark elevated #1C1C1E, #2C2C2E, #3A3A3C." gap={10}>
        {BACKGROUNDS.map(([title, mode, keys]) => (
          <Row columns={3} width={216}>
            {keys.map((key, index) => {
              const color = key.startsWith("#") ? key : tone(mode)[key as "bg"];
              return (
                <Variant title={`${title}, ${["primary", "secondary", "tertiary"][index]}`} caption={upper(color)}>
                  <div class="h-20 w-[216px] rounded-[16px]" style={`background:${color};box-shadow:inset 0 0 0 0.5px rgb(0 0 0 / 0.12)`} />
                </Variant>
              );
            })}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
