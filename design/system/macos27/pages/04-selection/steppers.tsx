import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { FieldStub, Stepper } from "../../components/stepper.tsx";
import type { StepperState } from "../../components/stepper.tsx";
import type { Mode } from "../../theme.ts";

const STATES: { state: StepperState; title: string; caption: string }[] = [
  { state: "default", title: "Default", caption: "Halves black 8%." },
  { state: "up", title: "Clicked · Up", caption: "Top half black 16%." },
  { state: "down", title: "Clicked · Down", caption: "Bottom half black 16%." },
  { state: "disabled", title: "Disabled", caption: "Halves 4%, chevrons black 25%." },
];

function Layout(props: { draw: (mode: Mode, state: StepperState) => Markup }): Markup {
  return (
    <>
      <Row columns={2} width={568}>
        {STATES.slice(0, 2).map((item) => (
          <Variant title={item.title} caption={item.caption}>
            <SurfacePair width={276} height={56} draw={(mode) => props.draw(mode, item.state)} />
          </Variant>
        ))}
      </Row>
      <Row columns={2} width={568}>
        {STATES.slice(2).map((item) => (
          <Variant title={item.title} caption={item.caption}>
            <SurfacePair width={276} height={56} draw={(mode) => props.draw(mode, item.state)} />
          </Variant>
        ))}
      </Row>
    </>
  );
}

export default function Steppers(): Markup {
  return (
    <Page title="Steppers" subtitle="macOS 27 · Figma page Steppers. 20 × 24, radius 6. Dark fills are inferred; the field is a stand-in.">
      <Section title="No field" description="The stepper alone: two 20 × 12 halves, a 14 × 1 separator, 12 pt chevrons." gap={12}>
        <Layout draw={(mode, state) => <Stepper mode={mode} state={state} />} />
      </Section>
      <Section title="Inside field" description="62 × 24: the stepper sits at the right edge of the field." gap={12}>
        <Layout
          draw={(mode, state) => (
            <div class="relative">
              <FieldStub mode={mode} width={62} disabled={state === "disabled"} />
              <div class="absolute top-0 right-0"><Stepper mode={mode} state={state} /></div>
            </div>
          )}
        />
      </Section>
      <Section title="Outside field" description="66 × 24: a 42 px field, 4 px gap, then the stepper." gap={12}>
        <Layout
          draw={(mode, state) => (
            <div class="flex items-center gap-1">
              <FieldStub mode={mode} width={42} disabled={state === "disabled"} />
              <Stepper mode={mode} state={state} />
            </div>
          )}
        />
      </Section>
    </Page>
  );
}
