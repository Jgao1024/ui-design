import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ActionButton, AlertPanel } from "../../components/overlays.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { Surface } from "../../components/surface.tsx";

export default function Alerts(): Markup {
  return (
    <Page title="Alerts" subtitle="Source: figma/reference/ios27/specs/06-overlays/Alerts__*.json">
      <Section title="Alert" description="300 wide Regular glass over a dimmed screen, 14 pt padding. Title 17 semibold, message 17; buttons 48 tall capsules, side by side (two actions) or stacked (three or more). An optional text field block is 272 x 123." gap={10}>
        {[
          { title: "Side-by-side", layout: "side" as const, field: false },
          { title: "Side-by-side with text field", layout: "side" as const, field: true },
          { title: "Stacked", layout: "stacked" as const, field: false },
          { title: "Stacked with text field", layout: "stacked" as const, field: true },
        ].map((c) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${c.title}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Button Layout=${c.layout === "side" ? "Side-by-Side" : "Stacked"}, Show Text Field=${c.field}`}>
                <Wallpaper mode={mode} width={402} height={c.layout === "side" ? (c.field ? 430 : 300) : c.field ? 540 : 420}>
                  <div class="absolute inset-0" style="background:rgb(0 0 0 / 0.2)" />
                  <AlertPanel mode={mode} layout={c.layout} field={c.field} />
                </Wallpaper>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>
      <Section title="Alert buttons" description="Roles: None (grey fill, label colour), Default (tint fill, white label), Destructive (red label), Cancel (tint label). 48 tall, 17/22 semibold." gap={10}>
        <Row columns={4} width={200}>
          {(["light", "dark"] as const).flatMap((mode) =>
            (["none", "default", "destructive", "cancel"] as const).map((role) => (
              <Variant title={`${role[0].toUpperCase() + role.slice(1)}, ${mode === "light" ? "Light" : "Dark"}`} caption={`Role=${role[0].toUpperCase() + role.slice(1)}`}>
                <Surface mode={mode} level={2} width={200} height={80} class="grid place-items-center"><ActionButton mode={mode} role={role} width={150} /></Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>
    </Page>
  );
}
