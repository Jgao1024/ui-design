import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { Glass } from "../../components/glass.tsx";
import { MODES, SurfacePair } from "../../components/stage.tsx";
import { Button } from "../../components/button.tsx";
import type { ButtonStyle } from "../../components/button.tsx";
import type { Mode } from "../../theme.ts";

const STYLES: { style: ButtonStyle; title: string }[] = [
  { style: "bordered", title: "Bordered" },
  { style: "tinted", title: "Tinted" },
  { style: "destructive", title: "Destructive" },
  { style: "prominent", title: "Prominent (default)" },
  { style: "prominent-destructive", title: "Prominent (default) Destructive" },
  { style: "borderless", title: "Borderless" },
];

function OverGlass(props: { mode: Mode; style: ButtonStyle }): Markup {
  return (
    <Backdrop mode={props.mode} width={176} height={64}>
      <Glass width={120} height={44} radius={16} mode={props.mode} size="panel">
        <div class="flex size-full items-center justify-center"><Button mode={props.mode} style={props.style} /></div>
      </Glass>
    </Backdrop>
  );
}

export default function ButtonsStates(): Markup {
  const row = (from: number) => (
    <Row columns={3} width={360}>
      {STYLES.slice(from, from + 3).map((item) => (
        <Variant title={item.title} caption={item.style === "borderless" ? "Label stays accent." : "Idle looks like Bordered."}>
          <SurfacePair width={176} height={64} draw={(mode) => <Button mode={mode} style={item.style} active={false} />} />
        </Variant>
      ))}
    </Row>
  );
  const glass = (from: number) => (
    <Row columns={3} width={360}>
      {STYLES.slice(from, from + 3).map((item) => (
        <Variant title={item.title} caption="Idle, on a Liquid Glass panel.">
          <div class="flex gap-2">{MODES.map((mode) => <OverGlass mode={mode} style={item.style} />)}</div>
        </Variant>
      ))}
    </Row>
  );
  return (
    <Page title="Buttons · Window and Glass" subtitle="macOS 27 · Figma page Buttons. Inactive window (Active = False) and Over-Glass context.">
      <Section
        title="Inactive window"
        description="When the window is not key, every style except Borderless draws as Bordered: fill black 8%, label black 85%. Clicked and Disabled variants are inferred to follow Bordered."
        gap={12}
      >
        {row(0)}
        {row(3)}
      </Section>
      <Section
        title="Over Glass"
        description="Buttons on a Liquid Glass surface. Figma's Over-Glass variants carry the same label colours as Content Area; the fill sits inside an instance that is not exported, so the buttons are drawn like Content Area."
        gap={12}
      >
        {glass(0)}
        {glass(3)}
      </Section>
    </Page>
  );
}
