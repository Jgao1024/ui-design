import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { TextField } from "../../components/text-field.tsx";
import type { FieldState } from "../../components/text-field.tsx";

const STATES: { state: FieldState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Fill white (Light) or #1E1E1E (Dark)." },
  { state: "focused", title: "Focused", caption: "Focus ring and a 2 × 18 accent cursor. The ring colour is inferred (accent 50%, 3 px)." },
  { state: "disabled", title: "Disabled", caption: "Fill at 50%." },
];

export default function TextFields(): Markup {
  return (
    <Page title="Text Fields" subtitle="macOS 27 · Figma page Text Fields. 120 × 24, radius 6, text SF Pro Medium 13 pt, 8 px in.">
      <Section
        title="With text"
        description="Show Text = True. The Dark fill has a white 4% outline. The Light border is a multiply layer without a value; it is drawn as a black hairline."
        gap={12}
      >
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={176} height={56} draw={(mode) => <TextField mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Empty" description="Show Text = False." gap={12}>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title}>
              <SurfacePair width={176} height={56} draw={(mode) => <TextField mode={mode} state={item.state} text="" />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
