import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { DisclosureButton } from "../../components/menu-button.tsx";
import type { ButtonState } from "../../components/button.tsx";

const STATES: { state: ButtonState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Fill black 8%, chevron black 85%." },
  { state: "clicked", title: "Clicked", caption: "Fill black 16%." },
  { state: "disabled", title: "Disabled", caption: "Fill black 4%, chevron black 25%." },
];

function States(props: { disclosed: boolean }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((item) => (
        <Variant title={item.title} caption={item.caption}>
          <SurfacePair width={176} height={64} draw={(mode) => <DisclosureButton mode={mode} state={item.state} disclosed={props.disclosed} />} />
        </Variant>
      ))}
    </Row>
  );
}

export default function DisclosureControls(): Markup {
  return (
    <Page title="Disclosure Controls" subtitle="macOS 27 · Figma page Disclosure Controls. Dark fills are inferred from Bordered.">
      <Section title="Closed" description="Disclosed = False. 24 × 24, radius 6, bold chevron pointing down." gap={12}>
        <States disclosed={false} />
      </Section>
      <Section title="Disclosed" description="Disclosed = True. The chevron points up." gap={12}>
        <States disclosed />
      </Section>
    </Page>
  );
}
