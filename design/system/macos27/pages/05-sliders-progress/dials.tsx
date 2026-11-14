import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Dial } from "../../components/slider.tsx";
import type { SliderState } from "../../components/slider.tsx";

const STATES: { state: SliderState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Fill black 8%, indicator black 85%." },
  { state: "clicked", title: "Clicked", caption: "Fill black 16%." },
  { state: "disabled", title: "Disabled", caption: "Fill black 6% over 3%, indicator black 25%." },
];

export default function Dials(): Markup {
  return (
    <Page title="Dials" subtitle="macOS 27 · Figma page Sliders and Dials, Dial / Circular Slider. 24 × 24. Dark fills are inferred: white in place of black.">
      <Section title="Dial" description="A circle with a 2 × 6 indicator at the top. The indicator turns around the centre. Figma draws it pointing up; the rotated copy is inferred." gap={12}>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={176} height={56} draw={(mode) => <Dial mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={`${item.title} · Turned`} caption="Indicator at 120°.">
              <SurfacePair width={176} height={56} draw={(mode) => <Dial mode={mode} state={item.state} angle={120} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
