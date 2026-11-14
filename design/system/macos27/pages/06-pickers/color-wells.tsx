import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { ColorPickerButton, ColorWell } from "../../components/well.tsx";
import type { WellState } from "../../components/well.tsx";

const STATES: { state: WellState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Swatch only; the capsule fill is not exported." },
  { state: "selected", title: "Selected", caption: "Capsule black 8%, swatch at 50%." },
  { state: "disabled", title: "Disabled", caption: "Capsule black 8%, swatch at 100% as exported." },
];

export default function ColorWells(): Markup {
  return (
    <Page title="Color Wells" subtitle="macOS 27 · Figma page Color Wells. Figma ships the Light mode only; Dark is inferred.">
      <Section title="Color well" description="48 × 24 capsule with a 42 × 18 swatch, 3 px in, and a black 10% outline on the swatch." gap={12}>
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption={item.caption}>
              <SurfacePair width={176} height={56} draw={(mode) => <ColorWell mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Color picker button" description="A 28 px circle with a rainbow rim and an 18 px colour dot. The selected ring is inferred." gap={12}>
        <Row columns={3} width={360}>
          <Variant title="Color Selected = False">
            <SurfacePair width={176} height={56} draw={(mode) => <ColorPickerButton mode={mode} />} />
          </Variant>
          <Variant title="Color Selected = True">
            <SurfacePair width={176} height={56} draw={(mode) => <ColorPickerButton mode={mode} selected />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
