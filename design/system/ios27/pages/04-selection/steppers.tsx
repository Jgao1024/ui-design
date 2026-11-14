import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Stepper } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";

const STATES: [string, string, Parameters<typeof Stepper>[0]["pressed"], Parameters<typeof Stepper>[0]["disabled"]][] = [
  ["Default", "Style=Default", undefined, undefined],
  ["Decrement pressed", "Style=Pressed on _Decrement", "minus", undefined],
  ["Increment pressed", "Style=Pressed on _Increment", "plus", undefined],
  ["Decrement disabled", "Style=Disabled on _Decrement", undefined, "minus"],
  ["Increment disabled", "Style=Disabled on _Increment", undefined, "plus"],
  ["Disabled", "Both halves Style=Disabled", undefined, "both"],
];

export default function Steppers(): Markup {
  return (
    <Page title="Steppers" subtitle="Source: figma/reference/ios27/specs/03-controls/Steppers__*.json">
      <Section title="Stepper" description="92 x 32: two 46 x 32 halves filled #767680 at 12 %, a 1 x 24 separator at 30 %, corner radius 8. Pressed darkens a half; disabled dims it." gap={10}>
        {(["light", "dark"] as const).map((mode) => (
          <Row columns={6} width={150}>
            {STATES.map(([title, caption, pressed, disabled]) => (
              <Variant title={`${title}, ${mode === "light" ? "Light" : "Dark"}`} caption={caption}>
                <Surface mode={mode} level="grouped" width={150} height={80} class="grid place-items-center">
                  <Stepper mode={mode} pressed={pressed} disabled={disabled} />
                </Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
