import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { Section } from "@design/components/figure.tsx";
import { Backdrop } from "../../components/backdrop.tsx";
import { Button } from "../../components/button.tsx";
import { UI } from "../../theme.ts";
import type { Mode } from "../../theme.ts";

function Shell(props: { mode: Mode; width: number; height: number; children: Markup }): Markup {
  const ui = UI[props.mode];
  return (
    <div
      class="overflow-hidden rounded-2xl"
      style={`width:${props.width}px;height:${props.height}px;background:${ui.window};color:${ui.label};box-shadow:0 18px 54px rgb(0 0 0 / ${props.mode === "light" ? 0.3 : 0.57}),0 0 1px rgb(0 0 0 / 0.8)`}
    >
      {props.children}
    </div>
  );
}

export default function Dialogs(): Markup {
  return (
    <Page title="Dialogs" subtitle="macOS 27 · Figma page Dialogs. Window-sized panels, radius 16. The dim overlay is black 20%.">
      <Section
        title="Small"
        description="390 × 318: a 262 px content area over a 56 px button row. Figma leaves both empty; the buttons are the default Button and the separator is inferred."
        gap={12}
      >
        <Row columns={1} width={1168}>
          <Variant title="Small dialog" caption="Radius 16, white (Light) or #1E1E1E (Dark), shadow 0 / 54.">
            <div class="flex gap-2">
              {(["light", "dark"] as Mode[]).map((mode) => (
                <Backdrop mode={mode} width={576} height={358}>
                  <Shell mode={mode} width={390} height={318}>
                    <div class="flex h-full flex-col">
                      <div class="flex-1" />
                      <div class="flex h-14 items-center justify-end gap-2 px-4" style={`box-shadow:inset 0 1px 0 ${UI[mode].separator}`}>
                        <Button mode={mode} />
                        <Button mode={mode} style="prominent" />
                      </div>
                    </div>
                  </Shell>
                </Backdrop>
              ))}
            </div>
          </Variant>
        </Row>
      </Section>
      <Section title="Large" description="1000 × 448 split view: a 210 px leading column and a 790 px trailing pane. Drawn at 52%." gap={12}>
        <Row columns={1} width={1168}>
          <Variant title="Large dialog" caption="Leading 210, trailing 790 (white). The leading fill is not in Figma's export; it is inferred as the sidebar colour.">
            <div class="flex gap-2">
              {(["light", "dark"] as Mode[]).map((mode) => (
                <Backdrop mode={mode} width={576} height={304}>
                  <div style="width:1000px;height:448px;transform:scale(0.52);flex:none">
                    <Shell mode={mode} width={1000} height={448}>
                      <div class="flex h-full">
                        <div class="h-full w-[210px]" style={`background:${mode === "light" ? "rgb(0 0 0 / 0.04)" : "rgb(255 255 255 / 0.05)"}`} />
                        <div class="h-full flex-1" />
                      </div>
                    </Shell>
                  </div>
                </Backdrop>
              ))}
            </div>
          </Variant>
        </Row>
      </Section>
    </Page>
  );
}
