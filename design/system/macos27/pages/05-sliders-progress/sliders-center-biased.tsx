import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Slider } from "../../components/slider.tsx";
import type { SliderState } from "../../components/slider.tsx";

const VALUES = [0, 0.25, 0.5, 0.75, 1];
const STATES: SliderState[] = ["idle", "clicked", "disabled"];
const TITLES = { idle: "Idle", clicked: "Clicked", disabled: "Disabled" };

function Values(props: { ticks: boolean; state: SliderState }): Markup {
  return (
    <>
      <Row columns={3} width={360}>
        {VALUES.slice(0, 3).map((value) => (
          <Variant title={`${value * 100}%`}>
            <SurfacePair
              width={176}
              height={56}
              draw={(mode) => <Slider mode={mode} value={value} state={props.state} ticks={props.ticks} centerBiased />}
            />
          </Variant>
        ))}
      </Row>
      <Row columns={3} width={360}>
        {VALUES.slice(3).map((value) => (
          <Variant title={`${value * 100}%`}>
            <SurfacePair
              width={176}
              height={56}
              draw={(mode) => <Slider mode={mode} value={value} state={props.state} ticks={props.ticks} centerBiased />}
            />
          </Variant>
        ))}
      </Row>
    </>
  );
}

export default function SlidersCenterBiased(): Markup {
  return (
    <Page title="Sliders · Center-biased" subtitle="macOS 27 · Figma page Sliders and Dials. The fill grows from the middle; the centre tick is 2 × 4 and fully opaque.">
      <Section title="Idle" description="Values 0 to 100%. At 50% nothing is filled." gap={12}>
        <Values ticks={false} state="idle" />
      </Section>
      <Section title="Idle · With ticks" description="The middle tick is taller (2 × 4, black 85%); the others are 2 × 2 at 25%." gap={12}>
        <Values ticks state="idle" />
      </Section>
      <Section title="Clicked and disabled" description="Groove 19% when clicked, 6% when disabled. Shown at 75%." gap={12}>
        <Row columns={2} width={568}>
          {STATES.slice(1).map((state) => (
            <Variant title={TITLES[state]}>
              <SurfacePair width={276} height={56} draw={(mode) => <Slider mode={mode} value={0.75} state={state} centerBiased />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
