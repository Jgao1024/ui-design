import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ActionSheetPanel } from "../../components/overlays.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function ActionSheets(): Markup {
  return (
    <Page title="Action sheets" subtitle="Source: figma/reference/ios27/specs/06-overlays/Action-Sheets__Action-Sheet.json">
      <Section title="Action sheet" description="300 x 296 Regular glass, radius 34. Title and message in a 272 wide block, then three 272 x 48 action capsules 8 apart." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={mode === "light" ? "Light" : "Dark"} caption="Show message=True">
              <Wallpaper mode={mode} width={402} height={420}>
                <div class="absolute inset-0" style="background:rgb(0 0 0 / 0.2)" />
                <ActionSheetPanel mode={mode} />
              </Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
