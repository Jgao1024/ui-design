import type { Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { SheetPhone } from "../../components/overlays.tsx";
import { AppIcon } from "../../components/system.tsx";
import { Icon, type IconName } from "../../components/icon.tsx";
import { textCss } from "../../components/text.tsx";
import { type Mode, tone } from "../../theme.ts";

function ShareContent(props: { mode: Mode }): Markup {
  const t = tone(props.mode);
  const actions: [string, IconName][] = [["Copy", "copy"], ["Add to Reading List", "bookmark"], ["Print", "doc"]];
  return (
    <div class="flex flex-col gap-4 pt-2" style={`color:${t.label}`}>
      <div class="flex items-center gap-3 px-4"><div class="size-12 rounded-lg" style="background:linear-gradient(135deg,#7ec8ff,#ff9ad5)" /><div class="flex flex-col"><span style={textCss("headline", { emphasized: true })}>Document.pdf</span><span style={`${textCss("footnote")};color:${t.label2}`}>PDF Document · 2 MB</span></div></div>
      <div class="flex gap-4 overflow-hidden px-4">
        {["Anna", "Ben", "Chen", "Dee"].map((n, i) => (
          <div class="flex w-[60px] flex-col items-center gap-1"><span class="grid size-[60px] place-items-center rounded-full text-white" style={`background:${["#ff8d28", "#34c759", "#0088ff", "#cb30e0"][i]};font-size:24px;font-weight:590`}>{n[0]}</span><span style={textCss("caption-1")}>{n}</span></div>
        ))}
      </div>
      <div class="flex gap-4 px-4">
        {["Messages", "Mail", "Notes", "Reminders"].map((n, i) => <div style={textCss("caption-1")}><AppIcon size={60} index={i} name={n} /></div>)}
      </div>
      <div class="mx-4 overflow-hidden rounded-[26px]" style={`background:${t.groupedRow}`}>
        {actions.map(([label, icon], i) => (
          <div class="flex h-[52px] items-center justify-between px-4" style={`${textCss("body")};${i > 0 ? `border-top:1px solid ${t.separator}` : ""}`}><span>{label}</span><Icon name={icon} size={20} /></div>
        ))}
      </div>
    </div>
  );
}

export default function ActivityViews(): Markup {
  return (
    <Page title="Activity views" subtitle="The share sheet. Source: figma/reference/ios27/specs/03-controls/Activity-Views__*.json">
      <Section title="Activity view, iPhone" description="A large sheet with a header (title, subtitle and a 44 pt close button), a row of contacts, a row of apps and a list of actions in a grouped list." gap={10}>
        <Row columns={2} width={402}>
          {(["light", "dark"] as const).map((mode) => (
            <Variant title={mode === "light" ? "Light" : "Dark"} caption="Activity View">
              <SheetPhone mode={mode} detent="large"><ShareContent mode={mode} /></SheetPhone>
            </Variant>
          ))}
        </Row>
      </Section>
    </Page>
  );
}
