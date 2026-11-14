import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { SurfacePair } from "../../components/stage.tsx";
import { Checkbox } from "../../components/toggle.tsx";
import type { Selection, ToggleState } from "../../components/toggle.tsx";

const STATES: ToggleState[] = ["idle", "clicked", "disabled"];
const TITLES = { idle: "Idle", clicked: "Clicked", disabled: "Disabled" };

function Group(props: { selection: Selection; active: boolean; captions: [string, string, string] }): Markup {
  return (
    <Row columns={3} width={360}>
      {STATES.map((state, index) => (
        <Variant title={TITLES[state]} caption={props.captions[index]}>
          <SurfacePair
            width={176}
            height={56}
            draw={(mode) => <Checkbox mode={mode} selection={props.selection} state={state} active={props.active} />}
          />
        </Variant>
      ))}
    </Row>
  );
}

export default function Checkboxes(): Markup {
  return (
    <Page title="Checkboxes" subtitle="macOS 27 · Figma page Toggles, Checkboxes. 54 × 16 with the default label.">
      <Section
        title="Off"
        description="16 × 16, radius 5.5, label 3 px to the right. Dark fills are inferred: the same alphas on white."
        gap={12}
      >
        <Group selection="off" active captions={["Fill black 10%, label black 85%.", "Fill black 19%.", "Fill black 5%, label black 25%."]} />
      </Section>
      <Section title="On" description="Accent fill #0088FF and a white checkmark. Clicked is drawn as 90% brightness." gap={12}>
        <Group selection="on" active captions={["Accent fill, white mark.", "Darker fill.", "Fill 50% (inferred), mark white 50%."]} />
      </Section>
      <Section title="Mixed" description="A white dash 6.5 × 2 replaces the checkmark." gap={12}>
        <Group selection="mixed" active captions={["Accent fill, white dash.", "Darker fill.", "Fill 50% (inferred), dash white 50%."]} />
      </Section>
      <Section
        title="Inactive window · On"
        description="Active = False: the on fill turns grey (black 10%) and the checkmark black 70% (Light). Disabled checkmark is black 22%."
        gap={12}
      >
        <Group selection="on" active={false} captions={["Grey fill, mark black 70%.", "Fill black 10% (inferred).", "Mark black 22%."]} />
      </Section>
    </Page>
  );
}
