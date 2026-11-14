import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ControlCenter, HomeScreen, LockScreen } from "../../components/examples.tsx";

export default function ExamplesHome(): Markup {
  return (
    <Page title="Examples: home, lock and control center" subtitle="Whole screens on a 402 x 874 iPhone. Source: figma/reference/ios27/specs/00-examples">
      {([["Home Screen", HomeScreen, "Widgets, an app grid with names, page dots and a glass dock."], ["Lock Screen", LockScreen, "Date and time, lock screen widgets, a stacked notification and two 58 pt glass controls."], ["Control Center", ControlCenter, "Glass control tiles in 1 x 1, 2 x 1 and 2 x 2 sizes."]] as const).map(([title, View, description]) => (
        <Section title={title} description={description} gap={10}>
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => <Variant title={mode === "light" ? "Light" : "Dark"} caption={title}><View mode={mode} /></Variant>)}
          </Row>
        </Section>
      ))}
    </Page>
  );
}
