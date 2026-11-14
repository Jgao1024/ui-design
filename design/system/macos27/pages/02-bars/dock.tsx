import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { ModePair } from "../../components/stage.tsx";
import { Dock, DockIcon } from "../../components/dock.tsx";
import type { Mode } from "../../theme.ts";

function Strip(props: { mode: Mode }): Markup {
  return (
    <Backdrop mode={props.mode} width={1168} height={96}>
      <Dock mode={props.mode} />
    </Backdrop>
  );
}

export default function DockPage(): Markup {
  return (
    <Page title="Dock" subtitle="macOS 27 · Figma page Menu Bar and Dock. App icons are bitmaps in Figma; tinted squares stand in.">
      <Section
        title="Dock"
        description="1152 × 55, radius 15, a glass bar. 23 app icons, a divider, then Folder and Trash. Icons are 36 × 36 with a 9 px gap and 8 px padding."
        gap={12}
      >
        <Row columns={1} width={1168}>
          <Variant title="Light" caption="Figma fill #4D4D4D 30% (luminosity) with a Liquid Glass edge; drawn with the small Glass.">
            <Strip mode="light" />
          </Variant>
        </Row>
        <Row columns={1} width={1168}>
          <Variant title="Dark" caption="Figma fill #454545 50% (luminosity); drawn with the small Glass.">
            <Strip mode="dark" />
          </Variant>
        </Row>
      </Section>
      <Section title="Dock icon" description="36 × 47: the 36 px icon, 3 px gap and an optional 4 px dot (#707070) that marks a running app." gap={12}>
        <Row columns={2} width={288}>
          <Variant title="Without dot" caption="Show Dot = false.">
            <ModePair width={140} height={72} draw={() => <DockIcon index={5} />} />
          </Variant>
          <Variant title="With dot" caption="Show Dot = true.">
            <ModePair width={140} height={72} draw={() => <DockIcon index={5} dot />} />
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
