import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { InputScreen, SettingsScreen } from "../../components/examples.tsx";

export default function ExamplesApps(): Markup {
  return (
    <Page title="Examples: lists and input" subtitle="Whole screens on a 402 x 874 iPhone. Source: figma/reference/ios27/specs/00-examples">
      <Section title="List with toolbar and tab bar" description="A large title under glass toolbar buttons, grouped lists with drill-in, toggle and image rows, and a four tab glass bar." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => <Variant title={mode === "light" ? "Light" : "Dark"} caption="Lists, Toolbars, Tab Bars"><SettingsScreen mode={mode} /></Variant>)}
        </Row>
      </Section>
      <Section title="Text field, controls and keyboard" description="A form with a focused text field, a segmented control, a switch and a slider above the iPhone keyboard." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => <Variant title={mode === "light" ? "Light" : "Dark"} caption="Text Fields, Keyboards, Toggles, Sliders"><InputScreen mode={mode} /></Variant>)}
        </Row>
      </Section>
    </Page>
  );
}
