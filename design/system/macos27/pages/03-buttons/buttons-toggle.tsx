import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Button } from "../../components/button.tsx";
import { Icon } from "../../components/icons.tsx";
import { UI } from "../../theme.ts";
import type { ButtonState } from "../../components/button.tsx";
import type { Mode } from "../../theme.ts";

const STATES: { state: ButtonState; title: string }[] = [
  { state: "idle", title: "Idle" },
  { state: "clicked", title: "Clicked" },
  { state: "disabled", title: "Disabled" },
];

// Buttons__Arrow-Buttons.json: 24 px circle, fill black 10% / 19% / 5%, symbol black 85% (25% disabled).
function Arrow(props: { mode: Mode; state: ButtonState }): Markup {
  const dark = props.mode === "dark";
  const index = STATES.findIndex((item) => item.state === props.state);
  const fill = [dark ? 0.12 : 0.1, dark ? 0.2 : 0.19, dark ? 0.06 : 0.05][index];
  const ink = props.state === "disabled" ? UI[props.mode].disabled : UI[props.mode].label;
  return (
    <div
      class="flex size-6 items-center justify-center rounded-full"
      style={`background:rgb(${dark ? "255 255 255" : "0 0 0"} / ${fill});color:${ink}`}
    >
      <Icon name="chevron.up.chevron.down" size={12} weight={1.6} />
    </div>
  );
}

export default function ButtonsToggle(): Markup {
  return (
    <Page title="Buttons · Toggle" subtitle="macOS 27 · Figma page Buttons. Toggle buttons and arrow buttons.">
      <Section
        title="Toggle · Off"
        description="A toggle button that is off looks like a Bordered button."
        gap={12}
      >
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption="On = False.">
              <SurfacePair width={176} height={64} draw={(mode) => <Button mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section
        title="Toggle · On"
        description="The label turns accent #0088FF and a #0078F0 tint is laid over the Bordered fill: 6% idle, 16% clicked, 2% disabled (label 30%)."
        gap={12}
      >
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title} caption="On = True.">
              <SurfacePair width={176} height={64} draw={(mode) => <Button mode={mode} state={item.state} on />} />
            </Variant>
          ))}
        </Row>
      </Section>
      <Section
        title="Arrow buttons"
        description="24 px circles. Fill black 10% idle, 19% clicked, 5% disabled; symbol black 85% (25% disabled). Dark values are inferred. The symbol is a stand-in."
        gap={12}
      >
        <Row columns={3} width={360}>
          {STATES.map((item) => (
            <Variant title={item.title}>
              <SurfacePair width={176} height={64} draw={(mode) => <Arrow mode={mode} state={item.state} />} />
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
