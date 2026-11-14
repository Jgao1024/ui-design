import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Window } from "../../components/window.tsx";
import type { WindowType } from "../../components/window.tsx";

/// One window type, Light and Dark side by side, in a 520 x 260 window.
function Type(props: { title: string; caption: string; type: WindowType; name: string | null; sidebar?: boolean; active?: boolean }): Markup {
  return (
    <Row columns={1} width={1168}>
      <Variant title={props.title} caption={props.caption}>
        <ModePair
          width={580}
          height={320}
          draw={(mode) => (
            <Window mode={mode} active={props.active} width={520} height={260} type={props.type} title={props.name} sidebar={props.sidebar} />
          )}
        />
      </Variant>
    </Row>
  );
}

export default function WindowTypes(): Markup {
  return (
    <Page title="Window Types" subtitle="macOS 27 · Figma page Windows, Windows - Composed. Default and Unified toolbars. Compact and Expanded are on Window Types · Toolbars.">
      <Section title="Default" description="A 30 px title bar. No toolbar buttons; the title is centred." gap={12}>
        <Type title="Default + Title" caption="Title bar 30." type="default" name="Title" />
        <Type title="Default without Title" caption="Title bar 30, no title." type="default" name={null} />
        <Type title="Default + Title + Sidebar" caption="The 240 px sidebar runs the full height; the traffic lights sit on it." type="default" name="Title" sidebar />
      </Section>
      <Section title="Unified Toolbar" description="Traffic lights, title and toolbar share one 52 px row. Toolbar parts are 36 px (XL)." gap={12}>
        <Type title="Unified Toolbar + Title" caption="Toolbar 52." type="unified" name="Title" />
        <Type title="Unified Toolbar without Title" caption="Toolbar 52, no title." type="unified" name={null} />
        <Type title="Unified Toolbar + Title + Sidebar" caption="Sidebar 240; the toolbar starts at its edge." type="unified" name="Title" sidebar />
        <Type title="Unified Toolbar + Title · Inactive" caption="Lights turn grey, toolbar symbols and title dim, the shadow is shallower." type="unified" name="Title" active={false} />
      </Section>
    </Page>
  );
}
