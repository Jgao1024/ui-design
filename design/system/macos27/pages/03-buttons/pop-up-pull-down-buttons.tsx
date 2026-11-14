import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { MenuButton } from "../../components/menu-button.tsx";
import type { MenuButtonKind } from "../../components/menu-button.tsx";
import type { ButtonState } from "../../components/button.tsx";

const STATES: { state: ButtonState; title: string; caption: string }[] = [
  { state: "idle", title: "Idle", caption: "Fill black 8%, label and chevron black 85%." },
  { state: "clicked", title: "Clicked", caption: "Fill black 16%." },
  { state: "disabled", title: "Disabled", caption: "Fill black 4%, label and chevron black 25%." },
];

function States(props: { kind: MenuButtonKind }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((item) => (
        <Variant title={item.title} caption={item.caption}>
          <SurfacePair width={176} height={64} draw={(mode) => <MenuButton mode={mode} kind={props.kind} state={item.state} />} />
        </Variant>
      ))}
    </Row>
  );
}

export default function PopUpPullDownButtons(): Markup {
  return (
    <Page title="Pop-up and Pull-down Buttons" subtitle="macOS 27 · Figma page Pop-up and Pull-down Buttons. Dark fills are inferred from Bordered.">
      <Section
        title="Pop-up button"
        description="100 × 24, radius 6. The label sits 12 px from the left; a 24 px double chevron closes the right edge."
        gap={12}
      >
        <States kind="pop-up" />
      </Section>
      <Section title="Pop-up button · No label" description="Show Label = False: a 24 px circle holding only the double chevron." gap={12}>
        <States kind="pop-up-icon" />
      </Section>
      <Section title="Pull-down button" description="Same 100 × 24 shape with a single down chevron." gap={12}>
        <States kind="pull-down" />
      </Section>
    </Page>
  );
}
