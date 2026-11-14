import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Slider } from "../../components/controls.tsx";
import { Surface } from "../../components/surface.tsx";

export default function Sliders(): Markup {
  return (
    <Page title="Sliders" subtitle="Source: figma/reference/ios27/specs/03-controls/Sliders__*.json">
      <Section title="Slider" description="A 368 x 50 row. 6 pt track at 20 %, fill in the tint, 38 x 24 white knob. Pressed turns the knob into a 60 x 40 glass lens. Disabled is 50 % opacity." gap={10}>
        {[0, 25, 50, 75, 100].flatMap((value) =>
          (["light", "dark"] as const).map((mode) => (
            <Row columns={3} width={400}>
              {[["Idle", false, false], ["Pressed", true, false], ["Disabled", false, true]].filter((_, i) => mode === "light" || i < 2).map(([state, pressed, disabled]) => (
                <Variant title={`${value} %, ${String(state).toLowerCase()}, ${mode === "light" ? "Light" : "Dark"}`} caption={`State=${state}, Value=${value}%`}>
                  <Surface mode={mode} level="grouped" width={400} class="grid place-items-center py-1">
                    <Slider mode={mode} value={value} pressed={Boolean(pressed)} disabled={Boolean(disabled)} />
                  </Surface>
                </Variant>
              ))}
            </Row>
          ))
        )}
      </Section>
      <Section title="Ticks and symbols" description="Optional 4 x 4 ticks under the track and min / max symbols at the ends (track shortens to 282)." gap={10}>
        <Row columns={2} width={400}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={`Ticks and symbols, ${mode === "light" ? "Light" : "Dark"}`} caption="Show Ticks=True, Show Symbols=True">
              <Surface mode={mode} level="grouped" width={400} class="grid place-items-center py-1">
                <Slider mode={mode} value={50} ticks symbols />
              </Surface>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
