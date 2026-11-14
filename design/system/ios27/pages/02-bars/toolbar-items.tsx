import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ButtonGroup, PageDots, SearchCapsule, ToolbarButton } from "../../components/chrome.tsx";
import { GlassControl } from "../../components/liquid-glass.tsx";
import { textCss } from "../../components/text.tsx";
import { Wallpaper } from "../../components/wallpaper.tsx";
import { type Mode, tone } from "../../theme.ts";

const MODES: Mode[] = ["light", "dark"];
const name = (mode: Mode) => (mode === "light" ? "Light" : "Dark");

/// One variant per mode on a small wallpaper, so the glass has something to show.
function Pair(props: { title: string; caption?: string; width?: number; height?: number; render: (mode: Mode) => Child }): Markup[] {
  return MODES.map((mode) => (
    <Variant title={`${props.title}, ${name(mode)}`} caption={props.caption}>
      <Wallpaper mode={mode} width={props.width ?? 240} height={props.height ?? 96} band={32}>{props.render(mode)}</Wallpaper>
    </Variant>
  ));
}

export default function ToolbarItems(): Markup {
  return (
    <Page title="Toolbar items" subtitle="Parts that go in toolbars. Source: figma/reference/ios27/specs/02-bars/Toolbars___*.json">
      <Section title="Buttons, 44 pt" description="Glass buttons for top bars. Symbol 44 x 44; text and group buttons grow with their content; prominent buttons are filled with the tint." gap={10}>
        <Row columns={4} width={240}>
          {Pair({ title: "Symbol", caption: "Type=Symbol", render: (m) => <ToolbarButton mode={m} symbol="share" /> })}
          {Pair({ title: "Symbol, prominent", caption: "Type=Symbol - Prominent", render: (m) => <ToolbarButton mode={m} symbol="plus" prominent /> })}
        </Row>
        <Row columns={4} width={240}>
          {Pair({ title: "Text", caption: "Type=Text", render: (m) => <ToolbarButton mode={m} label="Label" /> })}
          {Pair({ title: "Text, prominent", caption: "Type=Text - Prominent", render: (m) => <ToolbarButton mode={m} label="Label" prominent /> })}
        </Row>
        <Row columns={4} width={240}>
          {Pair({ title: "Back", caption: "Type=Back", render: (m) => <ToolbarButton mode={m} symbol="chevron-left" /> })}
          {Pair({ title: "Button group", caption: "Type=Button Group, 160 x 44", render: (m) => <ButtonGroup mode={m} symbols={["share", "star", "ellipsis"]} /> })}
        </Row>
        <Row columns={4} width={240}>
          {Pair({ title: "Symbol, disabled", caption: "State=Disabled", render: (m) => <ToolbarButton mode={m} symbol="share" disabled /> })}
          {Pair({ title: "Text, disabled", caption: "State=Disabled", render: (m) => <ToolbarButton mode={m} label="Label" disabled /> })}
        </Row>
      </Section>

      <Section title="Buttons, 48 pt" description="The bottom-bar size: 48 pt tall, 81 pt wide for a text label." gap={10}>
        <Row columns={4} width={240}>
          {Pair({ title: "Symbol", render: (m) => <ToolbarButton mode={m} symbol="share" size={48} /> })}
          {Pair({ title: "Text", render: (m) => <ToolbarButton mode={m} label="Label" size={48} /> })}
        </Row>
        <Row columns={4} width={240}>
          {Pair({ title: "Symbol, prominent", render: (m) => <ToolbarButton mode={m} symbol="plus" size={48} prominent /> })}
          {Pair({ title: "Button group", render: (m) => <ButtonGroup mode={m} symbols={["share", "star", "ellipsis"]} size={48} /> })}
        </Row>
      </Section>

      <Section title="Search" description="A glass capsule with a magnifier, text and microphone. 44 or 48 pt tall." gap={10}>
        {(["placeholder", "typing", "value"] as const).map((state) => (
          <Row columns={4} width={240}>
            {Pair({ title: `44 pt, ${state}`, caption: `State=${state}`, render: (m) => <SearchCapsule mode={m} state={state} /> })}
            {Pair({ title: `48 pt, ${state}`, caption: `State=${state}`, render: (m) => <SearchCapsule mode={m} state={state} size={48} /> })}
          </Row>
        ))}
      </Section>

      <Section title="Titles and subtitles" description="Title: Body 17 or Large Title 34 or Subheadline 15, all emphasized. Subtitle: Caption 12 or Subheadline 15." gap={10}>
        <Row columns={4} width={240}>
          {(["headline", "large-title", "subheadline"] as const).flatMap((style) =>
            MODES.map((mode) => (
              <Variant title={`${style === "headline" ? "Body" : style === "large-title" ? "Large Title" : "Subheadline"} title, ${name(mode)}`}>
                <div class="grid h-24 w-[240px] place-items-center rounded-[20px]" style={`background:${tone(mode).bg2};color:${tone(mode).label}`}>
                  <span style={textCss(style, { emphasized: true })}>Title</span>
                </div>
              </Variant>
            ))
          )}
          {(["caption-1", "subheadline"] as const).flatMap((style) =>
            MODES.map((mode) => (
              <Variant title={`${style === "caption-1" ? "Caption" : "Subheadline"} subtitle, ${name(mode)}`}>
                <div class="grid h-24 w-[240px] place-items-center rounded-[20px]" style={`background:${tone(mode).bg2};color:${tone(mode).label2}`}>
                  <span style={textCss(style)}>Subtitle</span>
                </div>
              </Variant>
            ))
          )}
        </Row>
      </Section>

      <Section title="Page dots" description="A glass capsule, 48 pt tall. 8 pt dots 8 apart with 20 pt on each side; the selected dot is solid." gap={10}>
        <Row columns={4} width={240}>
          {[2, 3, 5, 8].flatMap((count) =>
            Pair({ title: `${count} dots, first selected`, caption: `Dots=${count}, Selection=1`, render: (m) => <PageDots mode={m} count={count} selected={0} /> })
          )}
          {Pair({ title: "5 dots, third selected", caption: "Dots=5, Selection=3", render: (m) => <PageDots mode={m} count={5} selected={2} /> })}
        </Row>
      </Section>

      <Section title="Segmented control button" description="A 36 pt tall text segment in a toolbar. Selected gets a 12 % fill 4 pt wider than the label." gap={10}>
        <Row columns={4} width={240}>
          {Pair({
            title: "Unselected, selected",
            render: (m) => (
              <GlassControl mode={m} width={220} height={44}>
                <div class="flex h-full items-center justify-around px-1" style={`${textCss("subheadline", { weight: 510 })}`}>
                  <span class="grid h-9 w-[100px] place-items-center rounded-full" style={`background:${tone(m).fill3};color:${m === "dark" ? "#f5f5f5" : "#1a1a1a"}`}>Label</span>
                  <span class="grid h-9 w-[100px] place-items-center" style="color:#727272">Label</span>
                </div>
              </GlassControl>
            ),
          })}
        </Row>
      </Section>
    </Page>
  );
}
