import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { NotificationBanner, NotificationExpanded } from "../../components/system.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

const MODES = ["light", "dark"] as const;
const name = (m: "light" | "dark") => (m === "light" ? "Light" : "Dark");

export default function Notifications(): Markup {
  return (
    <Page title="Notifications" subtitle="Source: figma/reference/ios27/specs/07-system/Notifications__*.json">
      <Section title="Collapsed banner" description="386 x 63 Clear glass, radius 24, 38 pt icon. A stack shows one or two more banners 8 pt apart below it." gap={10}>
        {([1, 2, 3] as const).map((stack) => (
          <Row columns={2} width={420}>
            {MODES.map((mode) => (
              <Variant title={`Stack ${stack}, ${name(mode)}`} caption={`Stack=${stack}`}>
                <Wallpaper mode={mode} width={420} height={130}><NotificationBanner mode={mode} stack={stack} /></Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Expanded" description="370 x 370, radius 26, with a 66 pt header and a 250 x 104 action menu below." gap={10}>
        <Row columns={2} width={420}>
          {MODES.map((mode) => (
            <Variant title={`Expanded, ${name(mode)}`} caption="Show Menu=True">
              <Wallpaper mode={mode} width={420} height={560}><NotificationExpanded mode={mode} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
