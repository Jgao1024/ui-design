import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { HomeWidget, LockWidget } from "../../components/system.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

const MODES = ["light", "dark"] as const;

export default function Widgets(): Markup {
  return (
    <Page title="Widgets" subtitle="Source: figma/reference/ios27/specs/07-system/Widgets__*.json">
      <Section title="Home screen widgets" description="Radius 28. Small 164.67 square, Medium 349.67 x 164.33, Large 349.67 x 365. Content keeps an 18 pt padding." gap={10}>
        <Row columns={3} width={380}>
          {(["small", "medium", "large"] as const).map((size) => (
            <Variant title={size[0].toUpperCase() + size.slice(1)} caption={`Size=${size[0].toUpperCase() + size.slice(1)}`}>
              <Wallpaper mode="light" width={380} height={size === "large" ? 400 : 200}><HomeWidget size={size} hue={size === "small" ? 4 : size === "medium" ? 3 : 0} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
      <Section title="Lock screen widgets" description="Circular 72 x 72, rectangular 162 x 72, inline 327 x 26, clock 72 x 72. White content on a translucent plate over the wallpaper." gap={10}>
        {MODES.map((mode) => (
          <Row columns={4} width={240}>
            {(["circular", "clock", "rectangular", "inline"] as const).map((kind) => (
              <Variant title={`${kind[0].toUpperCase() + kind.slice(1)}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Lock Screen Widget / ${kind}`}>
                <Wallpaper mode={mode} width={240} height={110}><LockWidget mode={mode} kind={kind} /></Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
    </Page>
  );
}
