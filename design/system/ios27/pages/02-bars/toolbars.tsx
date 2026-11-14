import type { Child, Markup } from "@design/jsx/jsx-runtime";
import { Page } from "@design/components/page.tsx";
import { Section } from "@design/components/figure.tsx";
import { Row, Variant } from "@design/components/row.tsx";
import { ButtonGroup, ContentRows, HomeIndicator, PageDots, Screen, SearchCapsule, ToolbarButton } from "../../components/chrome.tsx";
import { GlassControl } from "../../components/liquid-glass.tsx";
import { TabBarPad } from "../../components/tab-bar.tsx";
import { textCss } from "../../components/text.tsx";
import { Surface } from "../../components/surface.tsx";
import { type Mode, tone } from "../../theme.ts";

type TopStyle = "default" | "compact-large" | "large-title" | "two-line" | "two-line-left";

const TOP_STYLES: [TopStyle, string, string, number][] = [
  ["default", "Default", "A centred title between a leading and a trailing 44 pt button. 54 pt tall.", 54],
  ["compact-large", "Compact Large", "A large title in the bar itself, trailing button. 54 pt tall.", 54],
  ["large-title", "Large Title", "Buttons on the first line, the large title and subtitle below. 125 pt tall.", 125],
  ["two-line", "Title 2 Line", "Centred title with a subtitle line, buttons either side. 54 pt tall.", 54],
  ["two-line-left", "Title 2 Line Left", "A leading button, then a left-aligned title with subtitle. 54 pt tall.", 54],
];

function TopBar(props: { mode: Mode; style: TopStyle }): Markup {
  const t = tone(props.mode);
  const m = props.mode;
  const title = (text: string, size: "body" | "title-1" | "title-3" = "body") => (
    <span style={`${textCss(size === "body" ? "headline" : size === "title-1" ? "large-title" : "title-3", { emphasized: true })};color:${t.label}`}>{text}</span>
  );
  const subtitle = (
    <span style={`${textCss("caption-1")};color:${t.label2}`}>Subtitle</span>
  );
  if (props.style === "large-title") {
    return (
      <div class="absolute inset-x-0 top-[62px] flex h-[125px] flex-col">
        <div class="flex h-11 items-center justify-between px-4"><ToolbarButton mode={m} symbol="chevron-left" /><ToolbarButton mode={m} symbol="ellipsis" /></div>
        <div class="px-4 pt-2.5"><div style={`${textCss("large-title", { emphasized: true })};color:${t.label}`}>Title</div><div style={`${textCss("subheadline")};color:${t.label2}`}>Subtitle</div></div>
      </div>
    );
  }
  const left = props.style === "compact-large" ? null : <ToolbarButton mode={m} symbol="chevron-left" />;
  const center = {
    "default": title("Title"),
    "compact-large": <span style={`${textCss("title-1", { emphasized: true })};color:${t.label}`}>Title</span>,
    "two-line": <div class="flex flex-col items-center">{title("Title")}{subtitle}</div>,
    "two-line-left": <div class="flex flex-col items-start">{title("Title")}{subtitle}</div>,
  }[props.style];
  return (
    <div class="absolute inset-x-0 top-[62px] flex h-11 items-center gap-2.5 px-4">
      {left ?? <span class="flex-1">{center}</span>}
      {left && <span class={`flex-1 ${props.style === "two-line-left" ? "" : "text-center"} ${props.style === "two-line-left" ? "" : "flex justify-center"}`}>{center}</span>}
      <ToolbarButton mode={m} symbol={props.style === "compact-large" ? "plus" : "ellipsis"} />
    </div>
  );
}

const BOTTOM: [string, string][] = [
  ["Buttons", "Two groups of 48 pt buttons, one at each side."],
  ["Buttons + Page Dots", "A 48 pt button at each side with page dots between."],
  ["Search", "A 346 x 48 search field."],
  ["Search with Focus", "A 286 pt field with a 48 pt button, shown while the keyboard is up."],
  ["Search + Leading Item", "A leading 48 pt button, then the 286 pt field."],
  ["Search + Trailing Item", "The 286 pt field, then a trailing 48 pt button."],
];

function BottomBar(props: { mode: Mode; type: string }): Markup {
  const m = props.mode;
  const field = (width: number) => <SearchCapsule mode={m} state="placeholder" width={width} size={48} />;
  let body: Child;
  switch (props.type) {
    case "Buttons":
      body = <><div class="flex gap-3"><ToolbarButton mode={m} symbol="plus" size={48} /><ToolbarButton mode={m} symbol="share" size={48} /></div><div class="flex gap-3"><ToolbarButton mode={m} symbol="bookmark" size={48} /><ToolbarButton mode={m} symbol="ellipsis" size={48} /></div></>;
      break;
    case "Buttons + Page Dots":
      body = <><ToolbarButton mode={m} symbol="chevron-left" size={48} /><PageDots mode={m} count={3} selected={0} /><ToolbarButton mode={m} symbol="chevron-right" size={48} /></>;
      break;
    case "Search":
      body = field(346);
      break;
    case "Search with Focus":
      body = <>{field(286)}<ToolbarButton mode={m} symbol="xmark" size={48} /></>;
      break;
    case "Search + Leading Item":
      body = <><ToolbarButton mode={m} symbol="compose" size={48} />{field(286)}</>;
      break;
    default:
      body = <>{field(286)}<ToolbarButton mode={m} symbol="mic" size={48} /></>;
  }
  return <div class="absolute inset-x-0 bottom-8 flex h-12 items-center justify-between px-7">{body}</div>;
}

function Strip(props: { mode: Mode; height: number; children?: Child; bottom?: boolean; barHeight?: number }): Markup {
  return (
    <Screen mode={props.mode} height={props.height} radius={24} island>
      <ContentRows mode={props.mode} rows={5} top={props.bottom ? 70 : 62 + (props.barHeight ?? 54) + 20} />
      {props.children}
    </Screen>
  );
}

export default function Toolbars(): Markup {
  return (
    <Page title="Toolbars" subtitle="iPhone and iPad bars. Source: figma/reference/ios27/specs/02-bars/Toolbars__Toolbar---*.json">
      {TOP_STYLES.map(([style, name, description, height]) => (
        <Section title={`Top, iPhone: ${name}`} description={description} gap={10}>
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={mode === "light" ? "Light" : "Dark"} caption={`Style=${name}`}>
                <Strip mode={mode} height={62 + height + 220} barHeight={height}><TopBar mode={mode} style={style} /></Strip>
              </Variant>
            ))}
          </Row>
        </Section>
      ))}

      <Section title="Bottom, iPhone" description="402 x 84: 28 pt side padding, 48 pt glass controls, 32 pt below for the home indicator." gap={10}>
        {BOTTOM.map(([type, caption]) => (
          <Row columns={2} width={402}>
            {(["light", "dark"] as const).map((mode) => (
              <Variant title={`${type}, ${mode === "light" ? "Light" : "Dark"}`} caption={caption}>
                <Strip mode={mode} height={290} bottom>
                  <BottomBar mode={mode} type={type} />
                  <div class="absolute bottom-0 left-0"><HomeIndicator mode={mode} /></div>
                </Strip>
              </Variant>
            ))}
          </Row>
        ))}
      </Section>

      <Section title="Top, iPad" description="820 wide with 10 pt side padding. Controls row 44 pt; the tab bar (491 x 44) sits in the middle of it. The large title style adds a title and subtitle row." gap={10}>
        <Row columns={2} width={820}>
          {(["light", "dark"] as const).map((mode) => {
            const t = tone(mode);
            return (
              <Variant title={`Compact Large with tab bar, ${mode === "light" ? "Light" : "Dark"}`} caption="Style=Compact Large, Tab Bar=True">
                <Surface mode={mode} width={820} height={190} radius={24}>
                  <ContentRows mode={mode} rows={3} top={74} />
                  <div class="absolute inset-x-2.5 top-2.5 flex h-11 items-center justify-between">
                    <ToolbarButton mode={mode} symbol="sidebar" />
                    <TabBarPad mode={mode} sidebar={false} search={false} />
                    <ButtonGroup mode={mode} symbols={["share", "ellipsis"]} />
                  </div>
                </Surface>
              </Variant>
            );
          })}
        </Row>
        <Row columns={2} width={820}>
          {(["light", "dark"] as const).map((mode) => {
            const t = tone(mode);
            return (
              <Variant title={`Large Title, ${mode === "light" ? "Light" : "Dark"}`} caption="Style=Large Title">
                <Surface mode={mode} width={820} height={250} radius={24}>
                  <ContentRows mode={mode} rows={3} top={150} />
                  <div class="absolute inset-x-2.5 top-2.5 flex h-11 items-center justify-between">
                    <ToolbarButton mode={mode} symbol="sidebar" />
                    <ButtonGroup mode={mode} symbols={["share", "ellipsis"]} />
                  </div>
                  <div class="absolute left-5 top-[66px]"><div style={`${textCss("large-title", { emphasized: true })};color:${t.label}`}>Title</div><div style={`${textCss("subheadline")};color:${t.label2}`}>Subtitle</div></div>
                </Surface>
              </Variant>
            );
          })}
        </Row>
      </Section>
    </Page>
  );
}
