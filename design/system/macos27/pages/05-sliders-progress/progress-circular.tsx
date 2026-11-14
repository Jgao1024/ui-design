import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { CircularProgress, Spinner } from "../../components/progress.tsx";

const VALUES = [0, 0.25, 0.5, 0.75, 1];

function Rings(props: { size: "small" | "large"; active: boolean }): Markup {
  const cell = (value: number) => (
    <Variant title={`${value * 100}%`}>
      <SurfacePair width={176} height={64} draw={(mode) => <CircularProgress mode={mode} size={props.size} value={value} active={props.active} />} />
    </Variant>
  );
  return (
    <>
      <Row columns={3} width={360}>{VALUES.slice(0, 3).map(cell)}</Row>
      <Row columns={3} width={360}>{VALUES.slice(3).map(cell)}</Row>
    </>
  );
}

export default function ProgressCircular(): Markup {
  return (
    <Page title="Progress Indicators · Circular" subtitle="macOS 27 · Figma page Progress Indicators. Rings are 16 px (Small) or 32 px (Large) with a 5 px band. Dark values are inferred.">
      <Section title="Large · Active" description="32 px ring; the fill sweeps clockwise from the top." gap={12}>
        <Rings size="large" active />
      </Section>
      <Section title="Small · Active" description="16 px ring." gap={12}>
        <Rings size="small" active />
      </Section>
      <Section title="Inactive window" description="Active = False: the fill is black 85% at 17%." gap={12}>
        <Row columns={3} width={360}>
          <Variant title="Large · 50%">
            <SurfacePair width={176} height={64} draw={(mode) => <CircularProgress mode={mode} size="large" value={0.5} active={false} />} />
          </Variant>
          <Variant title="Small · 50%">
            <SurfacePair width={176} height={64} draw={(mode) => <CircularProgress mode={mode} size="small" value={0.5} active={false} />} />
          </Variant>
        </Row>
      </Section>
      <Section title="Indeterminate spinner" description="Eight ticks fading from 100% to 15%, the whole group at 55%. The app turns it." gap={12}>
        <Row columns={3} width={360}>
          <Variant title="Large">
            <SurfacePair width={176} height={64} draw={(mode) => <Spinner mode={mode} size="large" />} />
          </Variant>
          <Variant title="Small">
            <SurfacePair width={176} height={64} draw={(mode) => <Spinner mode={mode} size="small" />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
