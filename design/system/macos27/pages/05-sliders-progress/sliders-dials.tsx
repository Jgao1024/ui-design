import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Slider } from "../../components/slider.tsx";
import type { SliderState } from "../../components/slider.tsx";

const STATES: { state: SliderState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Groove black 85% at 10%." },
  { state: "clicked", title: "Clicked", caption: "Groove at 19%." },
  { state: "disabled", title: "Disabled", caption: "Groove at 6%; fill and knob dimmed (inferred)." },
];

function States(props: { ticks: boolean; active?: boolean; value?: number }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((item) => (
        <Variant title={item.title} caption={item.caption}>
          <SurfacePair
            width={176}
            height={56}
            draw={(mode) => <Slider mode={mode} value={props.value ?? 0.5} state={item.state} ticks={props.ticks} active={props.active} />}
          />
        </Variant>
      ))}
    </Row>
  );
}

function Values(props: { ticks: boolean }): Markup {
  const values = [0, 0.25, 0.5, 0.75, 1];
  return (
    <>
      <Row columns={3} width={360}>
        {values.slice(0, 3).map((value) => (
          <Variant title={`${value * 100}%`}>
            <SurfacePair width={176} height={56} draw={(mode) => <Slider mode={mode} value={value} ticks={props.ticks} />} />
          </Variant>
        ))}
      </Row>
      <Row columns={3} width={360}>
        {values.slice(3).map((value) => (
          <Variant title={`${value * 100}%`}>
            <SurfacePair width={176} height={56} draw={(mode) => <Slider mode={mode} value={value} ticks={props.ticks} />} />
          </Variant>
        ))}
      </Row>
    </>
  );
}

export default function Sliders(): Markup {
  return (
    <Page title="Sliders" subtitle="macOS 27 · Figma page Sliders and Dials. 100 × 24. The filled colour is not in Figma's export: accent when active, grey when inactive (inferred).">
      <Section
        title="Without ticks"
        description="A 4 px groove running 3 px past each end, a 20 × 16 white knob. The knob's centre sits on the value."
        gap={12}
      >
        <States ticks={false} />
      </Section>
      <Section title="With ticks" description="Five 2 × 2 dots under the groove, 25% of the width apart." gap={12}>
        <States ticks />
      </Section>
      <Section title="Inactive window" description="Active = False: the fill turns grey." gap={12}>
        <States ticks={false} active={false} />
      </Section>
      <Section title="Values" description="0, 25, 50, 75 and 100% as in Figma." gap={12}>
        <Values ticks={false} />
      </Section>
    </Page>
  );
}
