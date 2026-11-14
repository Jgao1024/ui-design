import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Window } from "../../components/window.tsx";
import type { WindowType } from "../../components/window.tsx";

function Type(props: { title: string; caption: string; type: WindowType; name: string | null; sidebar?: boolean }): Markup {
  return (
    <Row columns={1} width={1168}>
      <Variant title={props.title} caption={props.caption}>
        <ModePair
          width={580}
          height={320}
          draw={(mode) => <Window mode={mode} width={520} height={260} type={props.type} title={props.name} sidebar={props.sidebar} />}
        />
      </Variant>
    </Row>
  );
}

export default function WindowTypesToolbars(): Markup {
  return (
    <Page title="Window Types · Toolbars" subtitle="macOS 27 · Figma page Windows, Windows - Composed. Compact and Expanded toolbars.">
      <Section title="Unified Compact Toolbar" description="Traffic lights, title and toolbar share one 40 px row. Toolbar parts are 24 px (Medium)." gap={12}>
        <Type title="Unified Compact Toolbar + Title" caption="Toolbar 40." type="compact" name="Title" />
        <Type title="Unified Compact Toolbar without Title" caption="Toolbar 40, no title." type="compact" name={null} />
        <Type title="Unified Compact Toolbar + Title + Sidebar" caption="Sidebar 240." type="compact" name="Title" sidebar />
      </Section>
      <Section title="Expanded Toolbar" description="A 31 px title bar with the title, and a separate 44 px toolbar row below it." gap={12}>
        <Type title="Expanded Toolbar + Title" caption="Title bar 31, toolbar 44." type="expanded" name="Title" />
        <Type title="Expanded Toolbar without Title" caption="Title bar 30, toolbar 44." type="expanded" name={null} />
        <Type title="Expanded Toolbar + Title + Sidebar" caption="Sidebar 240; the toolbar row sits in the content pane." type="expanded" name="Title" sidebar />
      </Section>
    </Page>
  );
}
