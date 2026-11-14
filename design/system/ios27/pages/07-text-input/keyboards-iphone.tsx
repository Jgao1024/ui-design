import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { IphoneKeyboard, NumberPad, type KeyboardType } from "../../components/keyboard.tsx";
import { Surface } from "../../components/surface.tsx";

const TYPES: [KeyboardType, string][] = [
  ["lower", "Lower Case"],
  ["upper", "Upper Case"],
  ["numeric", "Numeric"],
  ["punctuation", "Punctuation"],
  ["email", "Email"],
  ["web", "Web"],
  ["url", "URL"],
];

export default function KeyboardsIphone(): Markup {
  return (
    <Page title="Keyboards, iPhone" subtitle="Source: figma/reference/ios27/specs/04-input/Keyboards__Keyboard*.json and the _Keys, _Number Pad and _Bottom Buttons components">
      <Section title="Keyboard layouts" description="402 x 332 (307 for Web and URL). Keys 43 pt tall, radius 8.5, 6 pt apart; rows 11 pt apart. Fill #FFFFFF at 67 % Light, #EDEDED at 17 % Dark. A suggestion bar sits on top; the bottom row holds emoji and microphone." gap={10}>
        {TYPES.map(([type, name]) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${name}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Type=${name}`}>
                <Surface mode={mode} level={2} width={402} radius={0}><IphoneKeyboard mode={mode} type={type} /></Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Number pad" description="402 x 308: three columns of 125 x 47 keys, 6 pt apart; digits 23 pt with letters under them in 13 pt." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={mode === "light" ? "Light" : "Dark"} caption="Type=Number Pad">
              <Surface mode={mode} level={2} width={402} radius={0}><NumberPad mode={mode} /></Surface>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
