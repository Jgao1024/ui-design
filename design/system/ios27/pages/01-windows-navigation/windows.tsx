import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Surface } from "../../components/surface.tsx";
import { ResizeGrabber, WindowControls, WindowFrame } from "../../components/window.tsx";
import { SidebarItems, SidebarMaterial } from "../../components/sidebar.tsx";
import { type Mode, tone } from "../../theme.ts";

function Stage(props: { mode: Mode; sidebar?: boolean; active?: boolean }): Markup {
  const t = tone(props.mode);
  return (
    <Surface mode={props.mode} level={2} width={800} height={480} class="grid place-items-center">
      <WindowFrame mode={props.mode} active={props.active}>
        {props.sidebar && (
          <div class="absolute inset-y-0 left-0">
            <SidebarMaterial mode={props.mode} active={props.active ?? true} width={320} height={400}>
              <div class="pt-12"><SidebarItems mode={props.mode} /></div>
            </SidebarMaterial>
          </div>
        )}
        {props.sidebar && <div class="absolute inset-y-0 right-0 w-[400px]" style={`background:${t.bg}`} />}
      </WindowFrame>
    </Surface>
  );
}

export default function Windows(): Markup {
  return (
    <Page title="Windows" subtitle="iPadOS windows. Source: figma/reference/ios27/specs/01-navigation/Windows__*.json">
      <Section title="Window controls" description="A 41 x 22 capsule with close, minimise and expand dots. Active is coloured, inactive is grey." gap={10}>
        <Row columns={4} width={200}>
          {(["light", "dark"] as const).flatMap((mode) =>
            [true, false].map((active) => (
              <Variant title={`${mode === "light" ? "Light" : "Dark"}, ${active ? "active" : "inactive"}`} caption={`Window State=${active ? "Active" : "Inactive"}`}>
                <Surface mode={mode} level={2} width={200} height={72} class="grid place-items-center">
                  <WindowControls mode={mode} active={active} />
                </Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>

      <Section title="Resize grabber" description="32 x 32. A 3.5 pt arc in the bottom-right corner: 19.9 pt on a floating window, 12 pt on a full-screen window." gap={10}>
        <Row columns={4} width={200}>
          {(["light", "dark"] as const).flatMap((mode) =>
            [true, false].map((floating) => (
              <Variant title={`${mode === "light" ? "Light" : "Dark"}, ${floating ? "floating" : "full screen"}`} caption={`Window=${floating ? "Floating" : "Full Screen"}`}>
                <Surface mode={mode} level={2} width={200} height={72} class="grid place-items-center">
                  <ResizeGrabber mode={mode} floating={floating} />
                </Surface>
              </Variant>
            ))
          )}
        </Row>
      </Section>

      <Section title="Window" description="720 x 400, radius 34, shadow 0 30 140 at 30 %. Controls top left, resize grabber bottom right." gap={10}>
        <Row columns={2} width={800}>
          <Variant title="Light"><Stage mode="light" /></Variant>
          <Variant title="Dark"><Stage mode="dark" /></Variant>
        </Row>
      </Section>

      <Section title="Window with sidebar" description="A 320 pt sidebar on the translucent material and a 400 pt content view. The inactive window has a lighter sidebar and grey controls." gap={10}>
        <Row columns={2} width={800}>
          <Variant title="Light, active" caption="Mode=Active"><Stage mode="light" sidebar active /></Variant>
          <Variant title="Dark, active" caption="Mode=Active"><Stage mode="dark" sidebar active /></Variant>
        </Row>
        <Row columns={2} width={800}>
          <Variant title="Light, inactive" caption="Mode=Inactive"><Stage mode="light" sidebar active={false} /></Variant>
          <Variant title="Dark, inactive" caption="Mode=Inactive"><Stage mode="dark" sidebar active={false} /></Variant>
        </Row>
      </Section>
    </Page>
  );
}
