import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { ComboBox } from "../../components/text-field.tsx";
import type { ComboState } from "../../components/text-field.tsx";

const STATES: { state: ComboState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Button black 8%." },
  { state: "field-clicked", title: "Field clicked", caption: "Focus ring and accent cursor after the text." },
  { state: "button-clicked", title: "Button clicked", caption: "Button black 16%." },
  { state: "disabled", title: "Disabled", caption: "Field fill 50%, button black 4%, chevron black 25%." },
];

export default function ComboBoxes(): Markup {
  return (
    <Page title="Combo Boxes" subtitle="macOS 27 · Figma page Combo Boxes. 100 × 24. Figma ships Light only; Dark is inferred.">
      <Section
        title="Combo box"
        description="A text field with a 24 × 20 button, radius 4.5, 2 px from the right edge, holding a bold 11 pt down chevron. Text is the Figma default, Value."
        gap={12}
      >
        <Row columns={2} width={568}>
          {STATES.slice(0, 2).map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={276} height={56} draw={(mode) => <ComboBox mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
        <Row columns={2} width={568}>
          {STATES.slice(2).map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={276} height={56} draw={(mode) => <ComboBox mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
