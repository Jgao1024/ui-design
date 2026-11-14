import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Button } from "../../components/button.tsx";
import type { ButtonState, ButtonStyle } from "../../components/button.tsx";

const STATES: { state: ButtonState; title: string }[] = [
  { state: "idle", title: "Idle" },
  { state: "clicked", title: "Clicked" },
  { state: "disabled", title: "Disabled" },
];

function Styles(props: { style: ButtonStyle; captions: [string, string, string] }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((item, index) => (
        <Variant title={item.title} caption={props.captions[index]}>
          <SurfacePair width={176} height={64} draw={(mode) => <Button mode={mode} style={props.style} state={item.state} />} />
        </Variant>
      ))}
    </Row>
  );
}

export default function Buttons(): Markup {
  return (
    <Page title="Buttons" subtitle="macOS 27 · Figma page Buttons. Push buttons in an active window, Content Area.">
      <Section
        title="Bordered"
        description="67 × 24, radius 6, label SF Pro Medium 13 pt. Dark fill alphas are inferred; Figma only gives the Dark label colours."
        gap={12}
      >
        <Styles style="bordered" captions={["Fill black 8%, label black 85%.", "Fill black 16%.", "Fill black 4%, label black 25%."]} />
      </Section>
      <Section title="Bordered · Tinted" description="Accent label on an accent-tinted fill." gap={12}>
        <Styles style="tinted" captions={["Fill #0088FF 20%.", "Fill 28%.", "Fill 12%, label 40%."]} />
      </Section>
      <Section title="Bordered · Destructive" description="Same as Tinted with red #FF383C (Dark #FF4245)." gap={12}>
        <Styles style="destructive" captions={["Fill red 20%.", "Fill 28%.", "Fill 10%, label 40%."]} />
      </Section>
      <Section title="Bordered · Prominent (default)" description="Solid accent fill and a white label. The default button of a window." gap={12}>
        <Styles
          style="prominent"
          captions={["Fill #0088FF, label white.", "Darker fill (drawn as 90% brightness; Figma uses a burn layer).", "Fill 40%, label white 50%."]}
        />
      </Section>
      <Section title="Bordered · Prominent (default) Destructive" description="Solid red fill and a white label." gap={12}>
        <Styles
          style="prominent-destructive"
          captions={["Fill #FF383C, label white.", "Darker fill (90% brightness).", "Fill 40%, label white 50%."]}
        />
      </Section>
      <Section title="Borderless" description="Label only. The accent label darkens when clicked." gap={12}>
        <Styles style="borderless" captions={["Label #0088FF.", "Label darkened by black 18%.", "Label 50%."]} />
      </Section>
    </Page>
  );
}
