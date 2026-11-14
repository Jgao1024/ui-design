import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { DateChips, DatePicker, Calendar } from "../../components/pickers.tsx";
import { Surface } from "../../components/surface.tsx";

export default function DateTimePickers(): Markup {
  return (
    <Page title="Date and time pickers" subtitle="Source: figma/reference/ios27/specs/04-input/Date-and-Time-Pickers__*.json">
      <Section title="Collapsed" description="A 112 x 34 date capsule and an 86 x 34 time capsule, filled #767680 at 12 %, 6 pt apart. Selected turns the label to the tint." gap={10}>
        <Row columns={4} width={240}>
          {(["light", "dark"] as const).flatMap((mode) =>
            [[null, "Default"], ["date", "Selected"]].map(([sel, state]) => (
              <Variant title={`${state}, ${mode === "light" ? "Light" : "Dark"}`} caption={`State=${state}`}>
                <Surface mode={mode} level="grouped" width={240} height={72} class="grid place-items-center">
                  <DateChips mode={mode} selected={sel as "date" | null} />
                </Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>
      <Section title="Inline and compact" description="370 x 377. The inline picker sits on the page background; the compact picker is a popover (radius 13) on a material. Date area 338 x 325, time row 52." gap={10}>
        {(["inline", "compact"] as const).map((style) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${style === "inline" ? "Inline" : "Compact"}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Style=${style === "inline" ? "Inline" : "Compact"}`}>
                <Surface mode={mode} level="grouped" width={402} height={style === "compact" ? 425 : 377} class="grid place-items-center">
                  <DatePicker mode={mode} style={style} />
                </Surface>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Day states" description="Default, current (today, tint label), selected (tint circle), current and selected." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={`Calendar, ${mode === "light" ? "Light" : "Dark"}`} caption="State=Default, Current, Selected; day 1 is today, 15 is selected">
              <Surface mode={mode} level="grouped" width={402} class="grid place-items-center py-3"><Calendar mode={mode} /></Surface>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
