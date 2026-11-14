import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { AccessoryBar } from "../../components/keyboard.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

const BARS = [
  ["find", "Find", 50],
  ["replace", "Find and Replace", 121],
  ["search", "Search", 48],
  ["url", "URL", 48],
  ["form", "Web Form", 86],
  ["toolbar", "Toolbar", 48],
] as const;

export default function KeyboardAccessoryBars(): Markup {
  return (
    <Page title="Keyboard accessory bars" subtitle="Glass bars above the iPhone keyboard. Source: figma/reference/ios27/specs/04-input/Keyboards__Accessory-Bar---iPhone-*.json">
      <Section title="iPhone accessory bars" description="402 wide, 48 to 101 tall: 8 to 12 pt side padding, 48 pt glass fields and a 48 pt Done button." gap={10}>
        {BARS.map(([type, name, height]) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${name}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Accessory Bar - iPhone/${name}`}>
                <Wallpaper mode={mode} width={402} height={height + 40}><AccessoryBar mode={mode} type={type} /></Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
