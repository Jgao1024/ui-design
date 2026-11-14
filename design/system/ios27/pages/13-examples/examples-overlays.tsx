import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { OverlayScreen } from "../../components/examples.tsx";

export default function ExamplesOverlays(): Markup {
  return (
    <Page title="Examples: alerts, action sheets and menus" subtitle="Whole screens on a 402 x 874 iPhone. Source: figma/reference/ios27/specs/00-examples">
      {([["alert", "Alert", "A centred glass alert over the dimmed screen."], ["action-sheet", "Action sheet", "A glass action sheet at the bottom edge."], ["menu", "Menu", "A glass menu from a toolbar button."]] as const).map(([kind, title, description]) => (
        <Section title={title} description={description} gap={10}>
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => <Variant title={mode === "light" ? "Light" : "Dark"} caption={title}><OverlayScreen mode={mode} kind={kind} /></Variant>)}
          </Row>
        </Section>
      ))}
    </Page>
  );
}
