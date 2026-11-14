import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { SegmentedControl } from "../../components/segmented.tsx";
import type { Mode } from "../../theme.ts";

type Opts = { selected?: number; pressed?: number; disabled?: boolean; active?: boolean; selectable?: boolean };

function Cell(props: { title: string; caption: string } & Opts): Markup {
  return (
    <Variant title={props.title} caption={props.caption}>
      <SurfacePair
        width={176}
        height={56}
        draw={(mode: Mode) => <SegmentedControl mode={mode} selected={props.selected} pressed={props.pressed} disabled={props.disabled} active={props.active} selectable={props.selectable} />}
      />
    </Variant>
  );
}

export default function SegmentedControls(): Markup {
  return (
    <Page title="Segmented Controls" subtitle="macOS 27 · Figma page Segmented Controls. Three 56 × 20 segments; Figma's default control is 267 px wide.">
      <Section
        title="Selectable · Active window"
        description="24 px high, radius 6, 2 px inset. The selected segment is accent #0088FF with a white label. Dark fills are inferred: white in place of black."
        gap={12}
      >
        <Row columns={3} width={360}>
          <Cell title="Idle" caption="Separators between unselected segments." selected={0} />
          <Cell title="Clicked · unselected" caption="Pressed segment: fill black 16%; separators beside it hide." selected={0} pressed={1} />
          <Cell title="Clicked · selected" caption="Accent plus black 15%." selected={0} pressed={0} />
        </Row>
        <Row columns={3} width={360}>
          <Cell title="Disabled" caption="Selected segment at 45% opacity, label white 50%; others black 25%." selected={1} disabled />
        </Row>
      </Section>
      <Section title="Selectable · Inactive window" description="Active = False: the selected segment is grey, black 10% / 19% / 5%, with a black 85% label." gap={12}>
        <Row columns={3} width={360}>
          <Cell title="Idle" caption="Fill black 10%." selected={0} active={false} />
          <Cell title="Clicked" caption="Fill black 19%." selected={0} pressed={0} active={false} />
          <Cell title="Disabled" caption="Fill black 5%, label black 25%." selected={0} disabled active={false} />
        </Row>
      </Section>
      <Section title="Not selectable" description="Selectable = False: a momentary control with no selected segment." gap={12}>
        <Row columns={3} width={360}>
          <Cell title="Idle" caption="Every gap has a separator." selectable={false} />
          <Cell title="Clicked" caption="Pressed segment: black 16%." selectable={false} pressed={1} />
          <Cell title="Disabled" caption="Labels black 25%." selectable={false} disabled />
        </Row>
      </Section>
    </Page>
  );
}
