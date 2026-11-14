import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { FaceIdPanel } from "../../components/system.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";

export default function FaceId(): Markup {
  return (
    <Page title="Face ID" subtitle="Source: figma/reference/ios27/specs/07-system/Face-ID__Face-ID.json">
      <Section title="Face ID" description="402 x 190 with a 151 x 151 black bezel (radius 40, shadow 0 12 74 at 22 %). The glyph and checkmark are #87FA89, 70 pt." gap={10}>
        <Row columns={2} width={402}>
          {(["authenticating", "success"] as const).map((state) => (
            <Variant title={state === "success" ? "Success" : "Authenticating"} caption={`State=${state === "success" ? "Success" : "Authenticating"}`}>
              <Wallpaper mode="dark" width={402} height={190}><FaceIdPanel mode="dark" state={state} /></Wallpaper>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
