import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { LinearProgress } from "../../components/progress.tsx";

const VALUES = [0, 0.25, 0.5, 0.75, 1];

function Bars(props: { size: "small" | "medium"; active: boolean }): Markup {
  const cell = (value: number) => (
    <Variant title={`${value * 100}%`}>
      <SurfacePair width={176} height={56} draw={(mode) => <LinearProgress mode={mode} size={props.size} value={value} active={props.active} />} />
    </Variant>
  );
  return (
    <>
      <Row columns={3} width={360}>{VALUES.slice(0, 3).map(cell)}</Row>
      <Row columns={3} width={360}>{VALUES.slice(3).map(cell)}</Row>
    </>
  );
}

export default function ProgressIndicators(): Markup {
  return (
    <Page title="Progress Indicators · Linear" subtitle="macOS 27 · Figma page Progress Indicators. 100 px wide. Dark values are inferred: white in place of black.">
      <Section
        title="Medium · Active"
        description="10 px high capsule: unfilled black 85% at 10% with a black 7% outline, accent fill. The fill keeps at least the height of the bar at 0%."
        gap={12}
      >
        <Bars size="medium" active />
      </Section>
      <Section title="Small · Active" description="6 px high." gap={12}>
        <Bars size="small" active />
      </Section>
      <Section title="Inactive window" description="Active = False: the fill is black 85% at 17%. Shown at Medium; Small is the same at 6 px." gap={12}>
        <Row columns={3} width={360}>
          {[0.25, 0.5, 0.75].map((value) => (
            <Variant title={`${value * 100}%`}>
              <SurfacePair width={176} height={56} draw={(mode) => <LinearProgress mode={mode} size="medium" value={value} active={false} />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Indeterminate" description="A 48 px segment starting 26 px in; the app animates it." gap={12}>
        <Row columns={3} width={360}>
          <Variant title="Medium">
            <SurfacePair width={176} height={56} draw={(mode) => <LinearProgress mode={mode} size="medium" />} />
          </Variant>
          <Variant title="Small">
            <SurfacePair width={176} height={56} draw={(mode) => <LinearProgress mode={mode} size="small" />} />
          </Variant>
          <Variant title="Inactive · Medium">
            <SurfacePair width={176} height={56} draw={(mode) => <LinearProgress mode={mode} size="medium" active={false} />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
