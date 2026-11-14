import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { IpadKeyboard } from "../../components/keyboard.tsx";
import { Surface } from "../../components/surface.tsx";

export default function KeyboardsIpad(): Markup {
  return (
    <Page title="Keyboards, iPad" subtitle="Source: figma/reference/ios27/specs/04-input/Keyboards___Keyboard-Layouts-iPad-*.json and the _Keys - iPad components">
      <Section title="Keyboard layouts" description="Five rows: numbers, QWERTY, home row, bottom letters and the space row. Lower and upper case. Drawn 1210 wide (11-inch iPad); Figma's frame is 1250." gap={10}>
        {[false, true].map((upper) => (
          <Row columns={1} width={1210}>
            <Variant title={upper ? "Upper case" : "Lower case"} caption={upper ? "Keyboard Layouts/iPad/Uppercase" : "Keyboard Layouts/iPad/Lowercase"}>
              <div class="flex flex-col gap-4">
                {(["light", "dark"] as const).map((mode) => (
                  <Surface mode={mode} level={2} width={1210} radius={0}><IpadKeyboard mode={mode} upper={upper} /></Surface>
                ))}
              </div>
            </Variant>
          </Row>
        ))}
      </Section>
    </Page>
  );
}
